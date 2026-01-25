// Quem conecta? src\app\modules\authentication\store\authSlice.ts
// src\app\modules\authentication\types\auth.ts
export interface LoginRequest {
    user: string;
    password: string;
}

export interface User {
    id: string;
    user: string;
    last_login: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}
