export interface UserInfo {
    email: string;
    password: string;
}

export interface UserServiceReturn {
    status: number;
    data: any;
    request?: any | null;
}
