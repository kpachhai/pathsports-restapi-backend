import { MatchedDataOptions } from 'express-validator';

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
    match?: MatchDto;
    football?: FootballDto;
    basketball?: BasketballDto;
}

export interface MatchDto {
    match_date?: Date;
    opponent_team?: String;
    team_score?: Number;
    opponent_score?: Number;
    league?: String;
}

export interface FootballDto {
    assists?: Number; // Whole numbers
    fouls_suffered?: Number; // Whole numbers
    fouls_committed?: Number; // Whole numbers
    total_goals?: Number; // Whole numbers
    offsides?: Number; // Whole numbers
    red_cards?: Number; // Whole numbers
    shots?: Number; // Whole numbers
    shots_on_target?: Number; // Whole numbers
    starts?: Number; // Whole numbers
    yellow_cards?: Number; // Whole numbers
}

export interface BasketballDto {
    three_point_field_goal_percentage?: Number; // Decimal (0-100)
    three_point_field_goals_made_attempted?: Number; // Whole Number - Whole Number
    assists?: Number; // Whole Number
    blocks?: Number; // Whole Number
    field_goals_made_attempted?: Number; // Whole Number - Whole Number
    field_goal_percentage?: Number; // Decimal (0-100)
    free_throws_made_attempted?: Number; // Whole Number - Whole Number
    free_throw_percentage?: Number; // Decimal (0-100)
    minutes?: Number; // Whole Number
    fouls?: Number; // Whole Number
    points?: Number; // Whole Number
    rebounds?: Number; // Whole Number
    steals?: Number; // Whole Number
    turnovers?: Number; //  Whole Number
}

/*
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
*/
