export type BasePortfolioAsset = {
  ticker: string;
  shares: number;
  nickname: string;
  type: string;
  account: string;
  show: boolean;
  value: number;
};

export type AssetType = {
  type: string;
  shares: string | null;
  ticker: string;
  tickerPlaceholder: string;
  value?: string;
  nickname?:string;
};
