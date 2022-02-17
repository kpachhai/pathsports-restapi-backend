import { BirthDto, SocialDto, StatisticsDto } from './create.player.dto';

export interface PutPlayerDto {
    did: string;
    summary?: string;
    jerseyName?: string;
    fullName?: string;
    birth?: BirthDto;
    location?: string;
    height?: string;
    weight?: string;
    injured?: boolean;
    photo?: string;
    sport?: string;
    team?: string;
    club?: string;
    position?: string;
    social?: SocialDto;
    statistics?: [StatisticsDto];
    interests?: [string];
}
