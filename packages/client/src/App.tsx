import { useState } from "react";
import { OperationVariables, QueryResult, useQuery } from "@apollo/client";
import styled from "styled-components";

import { Simulation } from "./components/Simulation";
import { BenefitComparison } from "./components/BenefitComparison";
import { CompanySwingTrade } from "./types/CompanySwingTrade";
import { ALL_COMAPNY_QUERY, COMAPNY_QUERY } from "./queries/SwingTrades";
import { Input } from "./components/Input";

const INITIAL_VARIABLES = {
  code: "4776",
  capital: 1000000,
  range: 14,
  lossLine: 0.95,
  profitLine: 1.05,
};

export type Variables = typeof INITIAL_VARIABLES;

type Props = {
  variables: Variables;
  allCompany: QueryResult<
    {
      allCompanySwingTrades: CompanySwingTrade[];
    },
    OperationVariables
  >;
  company: QueryResult<
    {
      companySwingTrade: CompanySwingTrade;
    },
    OperationVariables
  >;
  setVariables: (variables: Variables) => void;
  handleItemClick: (code: string) => void;
};

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  variables,
  company,
  allCompany,
  setVariables,
  handleItemClick,
}) => {
  const variableList: { text: string; type: keyof Variables }[] = [
    { text: "元本", type: "capital" },
    { text: "最大保有期間", type: "range" },
    { text: "損切りライン", type: "lossLine" },
    { text: "利確ライン", type: "profitLine" },
  ];

  return (
    <div className={className}>
      <div>
        <div>
          <div className={`${className}-input-wrapper`}>
            {variableList.map((variable) => (
              <Input
                varableTypeText={variable.text}
                variableType={variable.type}
                variables={variables}
                setVariables={setVariables}
              />
            ))}
          </div>
          <button
            onClick={() => {
              allCompany.refetch(variables);
              company.refetch(variables);
            }}
          >
            Search
          </button>
        </div>
        <BenefitComparison
          loading={allCompany.loading}
          allCompanySwingTrades={allCompany.data?.allCompanySwingTrades}
          selectedCode={variables.code}
          handleClickItem={handleItemClick}
        />
      </div>
      <Simulation
        loading={company.loading}
        companySwingTrade={company.data?.companySwingTrade}
      />
    </div>
  );
};

const StyledComponent: React.FC<Props> = styled(Component)`
  display: flex;
  padding: 10px;
  font-family: "Exo 2", sans-serif;
  font-weight: bold;

  &-input-wrapper {
    color: transparent;
    -webkit-text-stroke: 1.5px #a9ffdc;
  }

  button {
    box-sizing: border-box;
    width: 100%;
    padding: 1.2em 2.8em;
    margin-bottom: 15px;
    font-weight: 700;
    color: #a9ffdc;
    text-transform: uppercase;
    cursor: pointer;
    background-color: transparent;
    border: 3px solid #a9ffdc;
    border-radius: 5px;
    transition: box-shadow 300ms ease-in-out, color 300ms ease-in-out;
    appearance: none;

    &:hover,
    &:focus {
      color: #242424;
      outline: 0;
      box-shadow: 0 0 40px 40px #a9ffdc inset;
    }
  }
`;

const Container: React.FC = () => {
  const [variables, setVariables] = useState(INITIAL_VARIABLES);
  const allCompany = useQuery<{ allCompanySwingTrades: CompanySwingTrade[] }>(
    ALL_COMAPNY_QUERY,
    { variables: INITIAL_VARIABLES, notifyOnNetworkStatusChange: true }
  );
  const company = useQuery<{ companySwingTrade: CompanySwingTrade }>(
    COMAPNY_QUERY,
    { variables: INITIAL_VARIABLES, notifyOnNetworkStatusChange: true }
  );

  const handleItemClick = (itemCode: string) => {
    setVariables({ ...variables, code: itemCode });
    company.refetch({ code: itemCode });
  };

  return (
    <StyledComponent
      variables={variables}
      allCompany={allCompany}
      company={company}
      setVariables={setVariables}
      handleItemClick={handleItemClick}
    />
  );
};

export const App = Container;
