import styled from "styled-components";

import { CompanySwingTrade } from "../types/CompanySwingTrade";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { markets, sectors, sortTypes } from "../constants/options";
import { ReactComponent as SortAscIcon } from "../assets/sort_asc.svg";
import { ReactComponent as SortDescIcon } from "../assets/sort_desc.svg";
import { sortCompanySwingTrades } from "../utils/utils";

type Props = {
  filters: { sector: string; market: string };
  sorting: { type: string; order: string };
  setFilter: (filter: { sector: string; market: string }) => void;
  setSorting: (sorting: { type: string; order: string }) => void;
} & OuterProps;

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  loading,
  allCompanySwingTrades,
  selectedCode,
  filters,
  sorting,
  handleClickItem,
  setFilter,
  setSorting,
}) => {
  return (
    <div className={className}>
      <div className="operations">
        <div className="filters">
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
        <div className="sort">
          <div className="sort-type-wrapper">
            <label htmlFor="sortType">ソート</label>
            <select
              name="sortType"
              onChange={(event) =>
                setSorting({ ...sorting, type: event.target.value })
              }
            >
              {sortTypes.map(({ value, text }) => (
                <option value={value}>{text}</option>
              ))}
            </select>
          </div>
          {sorting.order === "ASC" ? (
            <SortAscIcon
              onClick={() => setSorting({ ...sorting, order: "DESC" })}
            />
          ) : (
            <SortDescIcon
              onClick={() => setSorting({ ...sorting, order: "ASC" })}
            />
          )}
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
            .sort(sortCompanySwingTrades(sorting))
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
  .operations {
    display: flex;
    justify-content: space-between;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
  }

  .loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .filters {
    display: flex;
  }

  .sort {
    display: flex;
    fill: #a9ffdc;
  }

  .sector-wrapper,
  .market-wrapper,
  .sort-type-wrapper {
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

  const [sorting, setSorting] = useState<{ type: string; order: string }>({
    type: "CODE",
    order: "ASC",
  });

  return (
    <StyledComponent
      loading={loading}
      allCompanySwingTrades={allCompanySwingTrades}
      selectedCode={selectedCode}
      filters={filters}
      sorting={sorting}
      handleClickItem={handleClickItem}
      setFilter={setFilters}
      setSorting={setSorting}
    />
  );
};

export const BenefitComparison = Container;
