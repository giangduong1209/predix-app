interface IElectionBetted {
  amount: number;
  claimed: boolean;
  claimed_amount: number;
  created_at: number;
  delete: boolean;
  epoch: number;
  id: string;
  position: string;
  refund: number;
  round: IRoundElectionBetted;
  status: string;
  user_address: string;
  winning_amount: number;
}

interface IRoundElectionBetted {
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
