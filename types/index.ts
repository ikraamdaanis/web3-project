export type Nonce = {
  nonce: string;
  createdAt: number;
};

export enum TimelockBoost {
  NoLock = "noLock",
  OneMonth = "oneMonth",
  ThreeMonths = "threeMonths",
  SixMonths = "sixMonths",
  NineMonths = "nineMonths"
}

export const TimelockBoostLabels = {
  [TimelockBoost.NoLock]: "No Lock (1x)",
  [TimelockBoost.OneMonth]: "1 Month (2x)",
  [TimelockBoost.ThreeMonths]: "3 Months (3x)",
  [TimelockBoost.SixMonths]: "6 Months (4x)",
  [TimelockBoost.NineMonths]: "9 Months (5x)"
};
