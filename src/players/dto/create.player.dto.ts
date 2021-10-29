import { MatchedDataOptions } from 'express-validator';

export interface CreatePlayerDto {
    did: string;
    summary?: string;
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
    opponent_team?: string;
    team_score?: number;
    opponent_score?: number;
    league?: string;
}

export interface FootballDto {
    assists?: number; // Whole numbers
    fouls_suffered?: number; // Whole numbers
    fouls_committed?: number; // Whole numbers
    total_goals?: number; // Whole numbers
    offsides?: number; // Whole numbers
    red_cards?: number; // Whole numbers
    shots?: number; // Whole numbers
    shots_on_target?: number; // Whole numbers
    starts?: number; // Whole numbers
    yellow_cards?: number; // Whole numbers
}

export interface BasketballDto {
    three_point_field_goal_percentage?: number; // Decimal (0-100)
    three_point_field_goals_made_attempted?: number; // Whole Number - Whole Number
    assists?: number; // Whole Number
    blocks?: number; // Whole Number
    field_goals_made_attempted?: number; // Whole Number - Whole Number
    field_goal_percentage?: number; // Decimal (0-100)
    free_throws_made_attempted?: number; // Whole Number - Whole Number
    free_throw_percentage?: number; // Decimal (0-100)
    minutes?: number; // Whole Number
    fouls?: number; // Whole Number
    points?: number; // Whole Number
    rebounds?: number; // Whole Number
    steals?: number; // Whole Number
    turnovers?: number; //  Whole Number
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
