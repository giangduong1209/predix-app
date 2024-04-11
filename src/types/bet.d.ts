interface IBetData {
  id: string;
  amount: number;
  status: "UP" | "DOWN" | "" | string | undefined;
  value: string;
  refund: number;
  position: "UP" | "DOWN";
  winning_amount: number;
  epoch: number;
}
