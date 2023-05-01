import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CompanySwingTrade } from "../types/CompanySwingTrade";
import styled from "styled-components";

type Props = {
  companySwingTrade: CompanySwingTrade;
};

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  companySwingTrade,
}) => {
  return (
    <div className={className}>
      <div>
        ({companySwingTrade.companyInfo.code}){" "}
        {companySwingTrade.companyInfo.company_name} 株価:{" "}
        {companySwingTrade.current.toLocaleString()} 出来高:{" "}
        {companySwingTrade.totalVolume.toLocaleString()}
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
        height={740}
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
  .positive {
    color: #e555c7;
    -webkit-text-stroke: 1.5px #e555c7;
  }

  .negative {
    color: #a9ffdc;
    -webkit-text-stroke: 1.5px #a9ffdc;
  }
`;

const Container: React.FC<Props> = ({ companySwingTrade }) => {
  return <StyledComponent companySwingTrade={companySwingTrade} />;
};

export const SimulationGraph = Container;
