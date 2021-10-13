export interface CreatePlayerDto {
    did: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    birth?: BirthDto;
    nationality?: string;
    height?: string;
    weight?: string;
    injured?: boolean;
    photo?: string;
    sport?: string;
    team?: string;
    social?: SocialDto;
    statistics?: [StatisticsDto];
}

export interface BirthDto {
    date?: string;
    place?: string;
    country?: string;
}

export interface SocialDto {
    instagram?: string;
    facebook?: string;
    snapchat?: string;
    discord?: string;
}

export interface StatisticsDto {
    team?: TeamDto;
    league?: LeagueDto;
    games?: GamesDto;
    shots?: ShotsDto;
    goals?: GoalsDto;
    fouls?: FoulsDto;
    cards?: CardsDto;
    penalty?: PenaltyDto;
}

export interface TeamDto {
    did?: string;
    id?: string;
    name?: string;
    logo?: string;
}

export interface LeagueDto {
    did?: string;
    id?: string;
    name?: string;
    country?: string;
    logo?: string;
    flag?: string;
    season?: number;
}

export interface GamesDto {
    number?: number;
    position?: string;
    captain?: boolean;
}

export interface ShotsDto {
    total?: number;
    on?: number;
}

export interface GoalsDto {
    total?: number;
    assists?: number;
    saves?: number | null;
}

export interface FoulsDto {
    drawn?: number;
    committed?: number;
}

export interface CardsDto {
    yellow?: number;
    yellowred?: number;
    red?: number;
}

export interface PenaltyDto {
    won?: number | null;
    commited?: number | null;
    scored?: number;
    missed?: number;
    saved?: number | null;
}
