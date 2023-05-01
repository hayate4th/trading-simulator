import styled from "styled-components";

import { CompanySwingTrade } from "../types/CompanySwingTrade";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { markets, sectors } from "../constants/options";

type Props = {
  filters: { sector: string; market: string };
  setFilter: (filter: { sector: string; market: string }) => void;
} & OuterProps;

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  loading,
  allCompanySwingTrades,
  selectedCode,
  filters,
  handleClickItem,
  setFilter,
}) => {
  return (
    <div className={className}>
      <div className="filter-wrapper">
        <div className="sector-wrapper">
          <label htmlFor="sector">セクター</label>
          <select
            name="sector"
            onChange={(event) =>
              setFilter({ ...filters, sector: event.target.value })
            }
          >
            {sectors.map((sector) => (
              <option value={sector}>{sector}</option>
            ))}
          </select>
        </div>
        <div className="market-wrapper">
          <label htmlFor="market">マーケット</label>
          <select
            name="market"
            onChange={(event) =>
              setFilter({ ...filters, market: event.target.value })
            }
          >
            {markets.map((market) => (
              <option value={market}>{market}</option>
            ))}
          </select>
        </div>
      </div>

      <dl className={loading ? "loading" : ""}>
        {!loading ? (
          allCompanySwingTrades &&
          allCompanySwingTrades
            .filter(
              (companySwingTrade) =>
                (companySwingTrade.companyInfo.sector === filters.sector ||
                  filters.sector === "-") &&
                (companySwingTrade.companyInfo.market === filters.market ||
                  filters.market === "-")
            )
            .map((companySwingTrade) => (
              <dt
                className={
                  companySwingTrade.total > 0
                    ? companySwingTrade.companyInfo.code === selectedCode
                      ? "positive-selected"
                      : "positive"
                    : companySwingTrade.companyInfo.code === selectedCode
                    ? "negative-selected"
                    : "negative"
                }
                onClick={() =>
                  handleClickItem(companySwingTrade.companyInfo.code)
                }
              >
                {companySwingTrade.total > 0 ? "+" : "-"} (
                {companySwingTrade.companyInfo.code}){" "}
                {companySwingTrade.companyInfo.company_name}
              </dt>
            ))
        ) : (
          <div className="loading-wrapper">
            <BeatLoader color="#a9ffdc" />
          </div>
        )}
      </dl>
    </div>
  );
};

const StyledComponent: React.FC<Props> = styled(Component)`
  .loading-wrapper {
    display: flex;
    justify-content: center;
  }

  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .filter-wrapper {
    display: flex;
  }

  .sector-wrapper,
  .market-wrapper {
    position: relative;
    font-family: "Exo 2", sans-serif;
    font-weight: 200;
    color: transparent;
    -webkit-text-stroke: 1.5px #a9ffdc;

    label {
      position: absolute;
      top: 0;
      left: 15px;
      padding: 0 2px;
      font-size: 15px;
      color: #a9ffdc;
      pointer-events: none;
      background: #242424;
      transform: translateY(-50%);
    }

    select {
      padding: 15px;
      font-size: 15px;
      color: #a9ffdc;
      background: transparent;
      border: 3px solid #a9ffdc;
      border-bottom: none;
      outline: 0;
    }
  }

  .sector-wrapper {
    select {
      border-right: none;
      border-radius: 5px 0 0;
    }
  }

  .market-wrapper {
    select {
      border-radius: 0 5px 0 0;
    }
  }

  dl {
    width: 500px;
    height: 520px;
    padding: 5px;
    margin: 0;
    overflow-y: scroll;
    border: 3px solid #a9ffdc;
    border-radius: 0 0 5px 5px;
  }

  dt {
    font-family: "Exo 2", sans-serif;
    font-weight: 200;
    color: transparent;
    cursor: pointer;

    &.positive {
      -webkit-text-stroke: 1.5px #e555c7;

      &-selected {
        color: #242424;
        background: #e555c7;
      }
    }

    &.negative {
      -webkit-text-stroke: 1.5px #a9ffdc;

      &-selected {
        color: #242424;
        background: #a9ffdc;
      }
    }
  }
`;

type OuterProps = {
  loading: boolean;
  allCompanySwingTrades?: CompanySwingTrade[];
  selectedCode: string;
  handleClickItem: (code: string) => void;
};

const Container: React.FC<OuterProps> = ({
  loading,
  allCompanySwingTrades,
  selectedCode,
  handleClickItem,
}) => {
  const [filters, setFilters] = useState<{ sector: string; market: string }>({
    sector: "-",
    market: "-",
  });

  return (
    <StyledComponent
      loading={loading}
      allCompanySwingTrades={allCompanySwingTrades}
      selectedCode={selectedCode}
      filters={filters}
      handleClickItem={handleClickItem}
      setFilter={setFilters}
    />
  );
};

export const BenefitComparison = Container;
