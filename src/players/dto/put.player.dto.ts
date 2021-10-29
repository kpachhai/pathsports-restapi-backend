import { BirthDto, SocialDto, StatisticsDto } from './create.player.dto';

export interface PutPlayerDto {
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
