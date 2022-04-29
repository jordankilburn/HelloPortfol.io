export type BasePortfolioAsset = {
  ticker: string;
  shares: number;
  nickname: string;
  type: string;
  account: string;
  show: boolean;
  value: number;
  color?:string;
  roi?:number;
};

export type AssetType = {
  type: string;
  shares: string | null;
  ticker: string;
  tickerPlaceholder: string;
  value?: string;
  nickname?: string;
};

export type AssetInfo = {
  date: string | Date;
  close: number;
};

export type HistoricalAsset = {
  [key: string]: AssetInfo[];
};
