import { gql } from "@apollo/client";

export const ALL_COMAPNY_QUERY = gql`
  query SwingTrades(
    $capital: Int!
    $range: Int!
    $lossLine: Float!
    $profitLine: Float!
  ) {
    allCompanySwingTrades(
      capital: $capital
      range: $range
      lossLine: $lossLine
      profitLine: $profitLine
    ) {
      companyInfo {
        code
        company_name
        sector
        market
      }
      totalLoss
      totalProfit
      total
      recentConsecutive
    }
  }
`;

export const COMAPNY_QUERY = gql`
  query SwingTrades(
    $code: ID!
    $capital: Int!
    $range: Int!
    $lossLine: Float!
    $profitLine: Float!
  ) {
    companySwingTrade(
      code: $code
      capital: $capital
      range: $range
      lossLine: $lossLine
      profitLine: $profitLine
    ) {
      swingTrades {
        startAt
        endAt
        benefit
        close
        volume
      }
      companyInfo {
        code
        company_name
      }
      totalLoss
      totalProfit
      total
      totalVolume
      recentConsecutive
      maxConsecutiveLoss
      maxConsecutiveProfit
      current
    }
  }
`;
