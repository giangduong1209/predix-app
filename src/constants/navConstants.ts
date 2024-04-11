import { nanoid } from "nanoid";

const NAV_HEADER = [
  {
    id: "GAME",
    title: "Game",
    link: "/",
    // renderDot: "bg-[--colors-success]",
    items: [
      {
        title: "Prediction",
        link: "/prediction",
      },
      {
        title: "Dice",
        link: "/dice",
      },
      {
        title: "Market",
        link: "/market",
      },
      // {
      //   title: "Football",
      //   link: "/",
      // },
    ],
  },
  {
    id: "LEADERBOARD",
    title: "Leaderboard",
    link: "/prediction/leaderboard",
    // renderDot: "bg-[--colors-success]",
    items: [],
  },
  {
    id: "STAKING",
    title: "Staking (Coming soon)",
    link: "",
    // title: "Staking",
    // link: "/staking",
    // renderDot: "bg-[--colors-success]",
    items: [],
  },
  {
    id: "REFERRALS",
    title: "Referrals",
    link: "/referrals",
    // renderDot: "bg-[--colors-success]",
    items: [],
  },
  {
    id: "NFTs",
    title: "NFTs",
    link: "/mint",
    items: [],
  },
  {
    id: nanoid(),
    title: "Staking NFTs",
    link: "/staking-nfts",
    items: [],
  },
  {
    id: nanoid(),
    title: "Token Faucet",
    link: "/faucet",
    items: [],
  },
];

export const NAV_SUB_HEADER = [
  {
    id: "SubMenu1",
    title: "Prediction (BETA)",
    ref: "/",
  },
  {
    id: "SubMenu2",
    title: "Dice",
    ref: "/dice",
  },
  {
    id: "SubMenu3",
    title: "Trading Competition",
    ref: "/",
  },
  {
    id: "SubMenu4",
    title: "Trading Reward ",
    ref: "/",
  },
  {
    id: "SubMenu5",
    title: "Lottery",
    ref: "/",
  },
  {
    id: "SubMenu6",
    title: "Pottery (BETA)",
    ref: "/",
  },
];

export const LIST_GAME = [
  {
    id: "prediction",
    img: "/images/game/prediction.png",
    link: "/prediction",
  },
  {
    id: "diee",
    img: "/images/game/dice.png",
    link: "/dice",
  },
  // {
  //   id: "sport",
  //   img: "/images/game/sport.png",
  //   link: "/",
  // },
  {
    id: "market",
    img: "/images/game/market.png",
    link: "/market",
  },
];

export const LIST_BANNERS_GAME = [
  {
    id: nanoid(),
    name: "prediction",
    banner: "/svgs/banner/PRX_prediction_banner-01.svg",
    link: "/prediction",
  },
  {
    id: nanoid(),
    name: "dice",
    banner: "/svgs/banner/PRX_dice_banner-01.svg",
    link: "/dice",
  },
  {
    id: nanoid(),
    name: "sport",
    banner: "/svgs/banner/PRX_sport_banner-01.svg",
    link: "/sport",
  },
  {
    id: nanoid(),
    name: "market",
    banner: "/svgs/banner/PRX_market_banner-01.svg",
    link: "/market",
  },
];

export default NAV_HEADER;
