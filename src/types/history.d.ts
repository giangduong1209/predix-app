interface IRound {
  id: string;
  epoch: number;
  result: string;
  delele: boolean;

  locked: boolean;
  closed: boolean;
  cancel: boolean;
  lockPrice: number;

  bearAmount: number;
  closePrice: number;
  bullAmount: number;
  totalAmount: number;

  lockOracleId: number;
  lockTimestamp: number;
  closeOracleId: number;
  closeTimestamp: number;
  startTimestamp: number;
}

interface IRoundDice {
  id: string;
  sum: number;
  epoch: number;
  dice1: number;
  dice2: number;
  dice3: number;
  closed: boolean;
  cancel: boolean;
  delele: boolean;
  bearAmount: number;
  bullAmount: number;
  totalAmount: number;
  closeTimestamp: number;
  startTimestamp: number;
}

interface IHistory {
  id: string;
  epoch: string | number;
  refund: number;
  amount: number;
  status: string;
  delete: boolean;
  position: string;
  claimed: boolean;
  created_at: number;
  user_address: string;
  claimed_amount: number;
  winning_amount: number;
  round: IRound;
}

interface IHistoryDice {
  id: string;
  epoch: number;
  amount: number;
  refund: number;
  status: string;
  delete: boolean;
  claimed: boolean;
  position: string;
  created_at: number;
  user_address: string;
  winning_amount: number;
  claimed_amount: number;
  round: IRoundDice;
}
