import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { useMutation } from "@apollo/client";

import { CompanySwingTrade } from "../types/CompanySwingTrade";
import { ReactComponent as FavoriteIcon } from "../assets/favorite.svg";
import { ReactComponent as FavoriteFilledIcon } from "../assets/favorite_filled.svg";
import { SET_IS_FAVORITE } from "../mutations/CompanyInfo";
import { useState } from "react";

type Props = {
  viewIsFavorite: boolean;
  handleFavoriteClick: () => void;
} & OuterProps;

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  companySwingTrade,
  viewIsFavorite,
  handleFavoriteClick,
}) => {
  return (
    <div className={className}>
      <div className="company-info-wrapper">
        {viewIsFavorite ? (
          <FavoriteFilledIcon onClick={handleFavoriteClick} />
        ) : (
          <FavoriteIcon onClick={handleFavoriteClick} />
        )}
        <div className="company-info">
          <span className="company-info-ms">
            {companySwingTrade.companyInfo.market}{" "}
            {companySwingTrade.companyInfo.sector}
          </span>
          <span>
            ({companySwingTrade.companyInfo.code}){" "}
            {companySwingTrade.companyInfo.company_name}{" "}
          </span>
        </div>
        <div>
          株価: {companySwingTrade.current.toLocaleString()} 出来高:{" "}
          {companySwingTrade.totalVolume.toLocaleString()}
        </div>
      </div>
      <div>
        <div></div>
        <div>
          <div>シミュレーション結果</div>
          <ul>
            <li>
              損益合計:{" "}
              <span
                className={
                  companySwingTrade.total >= 0 ? "positive" : "negative"
                }
              >
                ¥{companySwingTrade.total.toLocaleString()}
              </span>{" "}
              (益:{" "}
              <span className="positive">
                ¥{companySwingTrade.totalProfit.toLocaleString()}
              </span>{" "}
              損:{" "}
              <span className="negative">
                ¥{companySwingTrade.totalLoss.toLocaleString()}
              </span>
              )
            </li>
            <li>
              最大連続利益日数:{" "}
              <span className="positive">
                {companySwingTrade.maxConsecutiveProfit}日
              </span>
            </li>
            <li>
              最大連続損失日数:{" "}
              <span className="negative">
                {companySwingTrade.maxConsecutiveLoss}日
              </span>
            </li>
            <li>
              直近の連続日数評価値:{" "}
              <span
                className={
                  companySwingTrade.recentConsecutive >= 0
                    ? "positive"
                    : "negative"
                }
              >
                {companySwingTrade.recentConsecutive}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <ComposedChart
        width={1200}
        height={730}
        data={companySwingTrade.swingTrades}
      >
        <CartesianGrid stroke="#A9FFDC" strokeWidth={2} />
        <XAxis
          dataKey="startAt"
          stroke="#A9FFDC"
          strokeWidth={2}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          yAxisId={1}
          orientation="left"
          domain={["auto", "auto"]}
          stroke="#A9FFDC"
          strokeWidth={2}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          yAxisId={2}
          orientation="right"
          domain={["auto", "auto"]}
          stroke="#A9FFDC"
          strokeWidth={2}
          tick={{ fontSize: 10 }}
        />
        <Tooltip />
        <Bar yAxisId={2} dataKey="benefit" stroke="#A9FFDC" strokeWidth={2} />
        <Line
          yAxisId={1}
          dataKey="close"
          stroke="#E555C7"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </div>
  );
};

const StyledComponent: React.FC<Props> = styled(Component)`
  .company-info {
    display: flex;
    flex-direction: column;

    &-ms {
      font-size: 13px;
    }

    &-wrapper {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  .positive {
    color: #e555c7;
    -webkit-text-stroke: 1.5px #e555c7;
  }

  .negative {
    color: #a9ffdc;
    -webkit-text-stroke: 1.5px #a9ffdc;
  }
`;

type OuterProps = {
  companySwingTrade: CompanySwingTrade;
};

const Container: React.FC<OuterProps> = ({ companySwingTrade }) => {
  const [viewIsFavorite, setViewIsFavorite] = useState(
    companySwingTrade.companyInfo.is_favorite
  );
  const [setIsFavorite] = useMutation(SET_IS_FAVORITE);

  const handleFavoriteClick = () => {
    setViewIsFavorite(!viewIsFavorite);
    setIsFavorite({
      variables: {
        code: companySwingTrade.companyInfo.code,
        isFavorite: !companySwingTrade.companyInfo.is_favorite,
      },
    });
  };
  return (
    <StyledComponent
      companySwingTrade={companySwingTrade}
      viewIsFavorite={viewIsFavorite}
      handleFavoriteClick={handleFavoriteClick}
    />
  );
};

export const SimulationGraph = Container;
