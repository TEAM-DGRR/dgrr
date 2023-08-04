export interface IGameConfig {
  // 게임룸 생성 성공 여부
  success: string;

  // 게임 정보
  turn: string;
  startTime: string;
  gameSessionId: string;
  openViduToken: string;

  // 내 유저 정보
  myInfo: IMemberInfo;
  enemyInfo: IMemberInfo;
}

export interface IMemberInfo {
  nickname: string;
  profileImage: string;
  description: string;
  rating: number;
  rank: "BRONZE" | "SILVER" | "GOLD";
}

export interface IImageResult {
  detected: boolean;
  laugh: number;
}

export interface IGameStatus {
  status: "READY" | "FIRST_ROUND" | "SECOND_ROUND";
  result: "LAUGH" | "HOLD_BACK";
  startTime: string;
}

export interface IGameResult {
  firstRoundTime: number;
  secondRoundTime: number;
  gameResult: string;
  reward: number;
  beforeRank: "BRONZE" | "SILVER" | "GOLD";
  afterRank: "BRONZE" | "SILVER" | "GOLD";
}
