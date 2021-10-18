export interface CreateUserDto {
    did: string;
    password: string;
    firstName?: string;
    lastName?: string;
    permissionLevel?: number;
}
