export type CompanySwingTrade = {
  companyInfo: {
    code: string;
    company_name: string;
    sector: string;
    market: string;
    is_favorite: boolean;
  };
  swingTrades: {
    startAt: string;
    endAt: string;
    benefit: number;
    close: number;
    volume: number;
  }[];
  totalLoss: number;
  totalProfit: number;
  total: number;
  absoluteTotal: number;
  totalVolume: number;
  recentConsecutive: number;
  maxConsecutiveLoss: number;
  maxConsecutiveProfit: number;
  current: number;
};
