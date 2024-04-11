interface IDiceData {
  bearAmount: number;
  bullAmount: number;
  cancel: boolean;
  closeTimestamp: number;
  closed: boolean;
  delete: boolean;
  dice1: number;
  dice2: number;
  dice3: number;
  epoch: number;
  id: string;
  startTimestamp: number;
  sum: number;
  totalAmount: number;
}

interface IDiceBet {
  amount: number;
  claimed: boolean;
  claimed_amount: number;
  created_at: number;
  delete: boolean;
  epoch: number;
  id: string;
  position: string;
  refund: number;
  round: IDiceData;
  status: string;
  user_address: string;
  winning_amount: number;
}
