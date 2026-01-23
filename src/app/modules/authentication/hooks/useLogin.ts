import { useState } from 'react';
import { useAuth } from './useAuth';
import { LoginRequest } from '../types/auth';

interface UseLoginReturn {
    login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
    isLoading: boolean;
    error: string | null;
}

export const useLogin = (): UseLoginReturn => {
    const { login: authLogin, loading, error } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: LoginRequest) => {
        // Validações básicas
        if (!credentials.user.trim()) {
            return { success: false, error: 'Digite o usuário' };
        }

        if (!credentials.password.trim()) {
            return { success: false, error: 'Digite a senha' };
        }

        setIsLoading(true);

        try {
            const result = await authLogin(credentials);
            return result;
            // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        isLoading: isLoading || loading,
        error,
    };
};