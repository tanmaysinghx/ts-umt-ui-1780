
export interface LoginRequest {
    email: string;
    password?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    transactionId?: string;
    configSummary?: {
        otpFlow: boolean;
    };
    data?: {
        downstreamResponse?: {
            success: boolean;
            data?: AuthTokenData; // The actual token data
            error?: string;
        };
    };
    error?: any;
}

export interface AuthTokenData {
    accessToken: string;
    refreshToken: string;
    email: string;
    roleName: string;
    roleId: string;
}

export interface OtpRequest {
    userEmail: string;
}

export interface SessionPayload {
    refreshToken: string;
    device: string;
    os: string;
    browser: string;
    location: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
