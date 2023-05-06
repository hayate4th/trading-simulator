import { CompanySwingTrade } from "../types/CompanySwingTrade";

export const sortCompanySwingTrades =
  (sorting: { type: string; order: string }) =>
  (a: CompanySwingTrade, b: CompanySwingTrade) => {
    let first;
    let second;
    if (sorting.order === "ASC") {
      first = a;
      second = b;
    } else {
      first = b;
      second = a;
    }

    switch (sorting.type) {
      case "CODE":
        return (
          parseInt(first.companyInfo.code) - parseInt(second.companyInfo.code)
        );
      case "MAX_CONSECUTIVE_PROFIT":
        return first.maxConsecutiveProfit - second.maxConsecutiveProfit;
      case "MAX_CONSECUTIVE_LOSS":
        return first.maxConsecutiveLoss - second.maxConsecutiveLoss;
      case "RECENT_CONSECUTIVES":
        return first.recentConsecutive - second.recentConsecutive;
      case "TOTAL":
        return first.total - second.total;
      case "ABSOLUTE_TOTAL":
        return first.absoluteTotal - second.absoluteTotal;
      case "TOTAL_PROFIT":
        return first.totalProfit - second.totalProfit;
      case "TOTAL_LOSS":
        return first.totalLoss - second.totalLoss;
      case "CURRENT":
        return first.current - second.current;
      case "TOTAL_VOLUME":
        return first.totalVolume - second.totalVolume;
      default:
        return (
          parseInt(first.companyInfo.code) - parseInt(second.companyInfo.code)
        );
    }
  };
