interface IBoxingBetted {
  amount: number;
  claimed: boolean;
  claimed_amount: number;
  created_at: number;
  delete: boolean;
  epoch: number;
  id: string;
  position: string;
  refund: number;
  round: IRoundBoxingBetted;
  status: string;
  user_address: string;
  winning_amount: number;
}

interface IRoundBoxingBetted {
  bearAmount: number;
  bullAmount: number;
  cancel: boolean;
  closeTimestamp?: number | null;
  closed: boolean;
  delete: boolean;
  epoch: number;
  id: string;
  result: string;
  startTimestamp: number;
  totalAmount: number;
}
