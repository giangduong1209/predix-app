interface IUser {
  user_address: string;
  ref: string;
  user_tree_belong: [];
  user_tree_commissions: string[];
  show: boolean;
  nickname: string;
  leaderboard: {
    round_played: number;
    round_winning: number;
    net_winnings: number;
    total_bnb: number;
    win_rate: number;
  };
}
