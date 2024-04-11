type LeaderBoardType =
  | "Net Winnings"
  | "Round Played"
  | "Total BNB"
  | "Win Rate";

interface IUserList {
  leaderboard: {
    round_played: number;
    round_winning: number;
    net_winnings: number;
    total_bnb: number;
    win_rate: number;
  };
  user_id: string;
  nickname: string;
}

interface ILeaderboardUserList {
  user_lists: IUserList[];
}

interface ILeaderboard extends ILeaderboardUserList {
  id: LeaderBoardType;
  type: LeaderBoardType;
  updated_at: number;
}
