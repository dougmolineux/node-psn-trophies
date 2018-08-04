export interface Trophies {
    bronze: Number;
    silver: Number;
    gold: Number;
    platinum: Number;
}

export interface TrophyTitle {
    npCommunicationId: String;
    trophyTitleName: String;
    trophyTitleDetail: String;
    trophyTitleIconUrl: String;
    trophyTitleSmallIconUrl: String;
    trophyTitlePlatfrom: String;
    hasTrophyGroups: Boolean;
    definedTrophies: Trophies;
    fromUser: FromUser;
}

export interface FromUser {
    onlineId: String;
    progress: Number;
    earnedTrophies: Trophies;
    hiddenFlag: Boolean;
    lastUpdateDate: String;
}