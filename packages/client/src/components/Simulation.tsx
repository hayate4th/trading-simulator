import styled from "styled-components";

import { SimulationGraph } from "./SimulationGraph";
import { CompanySwingTrade } from "../types/CompanySwingTrade";
import { BeatLoader } from "react-spinners";

type Props = {
  loading: boolean;
  companySwingTrade?: CompanySwingTrade;
};

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  loading,
  companySwingTrade,
}) => {
  return loading ? (
    <div className={`${className}-loading`}>
      <BeatLoader color="#a9ffdc" size={60} />
    </div>
  ) : (
    <div className={className}>
      {companySwingTrade && companySwingTrade.swingTrades.length > 0 ? (
        <div className="simulations-wrapper">
          {<SimulationGraph companySwingTrade={companySwingTrade} />}
        </div>
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
};

const StyledComponent: React.FC<Props> = styled(Component)`
  position: relative;
  font-family: "Exo 2", sans-serif;
  font-weight: 200;
  color: transparent;
  -webkit-text-stroke: 1.5px #a9ffdc;

  .simulations-wrapper {
    display: flex;
    padding: 20px 0 20px 20px;
    color: #a9ffdc;
  }

  &-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
  }
`;

const Container: React.FC<Props> = ({ loading, companySwingTrade }) => {
  return (
    <StyledComponent loading={loading} companySwingTrade={companySwingTrade} />
  );
};

export const Simulation = Container;
