export interface UserInfo {
    userId?: string;
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface ServiceReturn {
    status: number;
    data: any;
}
