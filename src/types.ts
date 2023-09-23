export interface UserInfo {
    userId?: string;
    email: string;
    password: string;
    hasCreatedBudget?: boolean;
    accessToken?: string;
    refreshToken?: string;
}

export interface ServiceReturn {
    status: number;
    data: any;
    extra?: any;
}
