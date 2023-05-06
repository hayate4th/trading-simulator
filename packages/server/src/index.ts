import { ApolloServer, gql } from "apollo-server";

import { knex } from "./connection";

const UNIT = 100;

const typeDefs = gql`
  scalar Date

  type DailyTransaction {
    code: ID!
    date: Date!
    open: Float!
    highest: Float!
    lowest: Float!
    close: Float!
    volume: Float!
  }

  type CompanyInfo {
    code: ID!
    company_name: String!
    market: String!
    sector: String!
  }

  type SwingTrade {
    startAt: Date!
    endAt: Date!
    benefit: Float!
    close: Float!
    volume: Float!
  }

  type CompanySwingTrade {
    companyInfo: CompanyInfo
    swingTrades: [SwingTrade]
    totalLoss: Float!
    totalProfit: Float!
    total: Float!
    absoluteTotal: Float!
    totalVolume: Float!
    maxConsecutiveLoss: Int!
    maxConsecutiveProfit: Int!
    recentConsecutive: Int!
    current: Float!
  }

  type Query {
    dailyTransaction(code: ID!, date: String!): DailyTransaction
    dailyTransactions(code: ID!): [DailyTransaction]
    companyInfo(code: ID!): CompanyInfo
    allCompanyInfos: [CompanyInfo]
    companySwingTrade(
      code: ID!
      capital: Int!
      range: Int!
      lossLine: Float!
      profitLine: Float!
    ): CompanySwingTrade
    allCompanySwingTrades(
      capital: Int!
      range: Int!
      lossLine: Float!
      profitLine: Float!
    ): [CompanySwingTrade]
  }

  type Mutation {
    addSwingMemo(code: ID!): [Int]
  }
`;

const getTransactionsByCode = async (code: string) => {
  const result = await knex
    .select()
    .from("daily_transaction")
    .where("code", code)
    .orderBy("date", "asc");
  return result;
};

const getTransactionsByCodeAndDate = async (code: string, date: string) => {
  const result = await knex
    .select()
    .from("daily_transaction")
    .where("code", code)
    .where("date", date);
  return result[0];
};

const getCompanyInfo = async (code: string) => {
  const result = await knex.select().from("company_info").where("code", code);
  return result[0];
};

const getAllCompanyInfos = async () => {
  const result = await knex.select().from("company_info");
  return result;
};

const simulateSwingTrade = async (
  code: string,
  capital: number,
  range: number,
  lossLine: number,
  profitLine: number
) => {
  const transactions = await getTransactionsByCode(code);

  return transactions.map((transaction, index) => {
    const { date, close, volume } = transaction;
    const boughtStocksInUnits = Math.floor(capital / close / UNIT);
    if (boughtStocksInUnits <= 0)
      return {
        startAt: date,
        endAt: date,
        benefit: 0,
        close,
        volume,
      };
    const boughtStocks = boughtStocksInUnits * UNIT;

    const startingAsset = boughtStocks * close;
    for (let i = index + 1; i < index + range; i++) {
      if (transactions[i] === undefined) {
        return {
          startAt: date,
          endAt: transactions[i - 1].date,
          benefit: transactions[i - 1].close * boughtStocks - startingAsset,
          close,
          volume,
        };
      }
      const result = transactions[i].close * boughtStocks;
      const line = result / startingAsset;
      if (lossLine >= line) {
        return {
          startAt: date,
          endAt: transactions[i].date,
          benefit: result - startingAsset,
          close,
          volume,
        };
      } else if (profitLine <= line) {
        return {
          startAt: date,
          endAt: transactions[i].date,
          benefit: result - startingAsset,
          close,
          volume,
        };
      }
    }
    return {
      startAt: date,
      endAt: transactions[index + range - 1].date,
      benefit:
        transactions[index + range - 1].close * boughtStocks - startingAsset,
      close,
      volume,
    };
  });
};

const getCompanySwingTrade = async (
  code: string,
  capital: number,
  range: number,
  lossLine: number,
  profitLine: number
) => {
  const swingTrades = await simulateSwingTrade(
    code,
    capital,
    range,
    lossLine,
    profitLine
  );
  let totalLoss = 0;
  let totalProfit = 0;
  let consecutives = 0;
  let maxConsecutiveLoss = 0;
  let maxConsecutiveProfit = 0;
  let recentConsecutive = 0;
  let totalVolume = 0;
  swingTrades.forEach((swingTrade) => {
    totalVolume += swingTrade.volume;
    if (swingTrade.benefit < 0) {
      totalLoss += swingTrade.benefit;
      if (consecutives < 0) {
        consecutives--;
      } else {
        if (consecutives > maxConsecutiveProfit) {
          maxConsecutiveProfit = consecutives;
        }
        recentConsecutive = consecutives;
        consecutives = -1;
      }
    } else if (swingTrade.benefit > 0) {
      totalProfit += swingTrade.benefit;
      if (consecutives > 0) {
        consecutives++;
      } else {
        if (consecutives < maxConsecutiveLoss) {
          maxConsecutiveLoss = consecutives;
        }
        recentConsecutive = consecutives;
        consecutives = 1;
      }
    } else {
      if (consecutives > maxConsecutiveProfit)
        maxConsecutiveProfit = consecutives;
      else if (consecutives < maxConsecutiveLoss)
        maxConsecutiveLoss = consecutives;
      recentConsecutive = consecutives;
      consecutives = 0;
    }
  });
  if (consecutives > maxConsecutiveProfit) maxConsecutiveProfit = consecutives;
  else if (consecutives < maxConsecutiveLoss) maxConsecutiveLoss = consecutives;

  const companyInfo = await getCompanyInfo(code);
  const total = totalProfit + totalLoss;
  return {
    companyInfo,
    swingTrades,
    totalLoss,
    totalProfit,
    total,
    absoluteTotal: Math.abs(total),
    totalVolume,
    maxConsecutiveLoss: -maxConsecutiveLoss,
    maxConsecutiveProfit,
    recentConsecutive,
    current: swingTrades[swingTrades.length - 1].close,
  };
};

const allCompanySwingTrades = async (
  capital: number,
  range: number,
  lossLine: number,
  profitLine: number
) => {
  const companyInfos = await getAllCompanyInfos();
  const allCompanySwingTrades = await Promise.all(
    companyInfos.map(async (companyInfo) =>
      getCompanySwingTrade(
        companyInfo.code,
        capital,
        range,
        lossLine,
        profitLine
      )
    )
  );

  return allCompanySwingTrades
    .filter(
      (companySwingTrade) =>
        companySwingTrade.totalLoss !== 0 && companySwingTrade.totalProfit !== 0
    )
    .filter((companySwingTrade) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const recentDate = new Date(
        companySwingTrade.swingTrades[
          companySwingTrade.swingTrades.length - 1
        ].startAt
      );
      return recentDate >= new Date(date);
    });
};

const addSwingMemo = async (code: string) => {
  const result = await knex("swing_memo").insert({ code }).returning("*");
  return result;
};

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      dailyTransaction: (
        _: unknown,
        contextValue: { code: string; date: string }
      ) => getTransactionsByCodeAndDate(contextValue.code, contextValue.date),
      dailyTransactions: (_: unknown, contextValue: { code: string }) =>
        getTransactionsByCode(contextValue.code),
      companyInfo: (_: unknown, contextValue: { code: string }) =>
        getCompanyInfo(contextValue.code),
      allCompanyInfos: getAllCompanyInfos,
      companySwingTrade: (
        _: unknown,
        contextValue: {
          code: string;
          capital: number;
          range: number;
          lossLine: number;
          profitLine: number;
        }
      ) =>
        getCompanySwingTrade(
          contextValue.code,
          contextValue.capital,
          contextValue.range,
          contextValue.lossLine,
          contextValue.profitLine
        ),
      allCompanySwingTrades: (
        _: unknown,
        contextValue: {
          capital: number;
          range: number;
          lossLine: number;
          profitLine: number;
        }
      ) =>
        allCompanySwingTrades(
          contextValue.capital,
          contextValue.range,
          contextValue.lossLine,
          contextValue.profitLine
        ),
    },
    Mutation: {
      addSwingMemo: (_: unknown, contextValue: { code: string }) =>
        addSwingMemo(contextValue.code),
    },
  },
  csrfPrevention: true,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
