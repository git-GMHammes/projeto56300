// Hook básico para registro (placeholder)
// TODO: Implementar quando tiver API de registro

import { useState } from 'react';

interface RegisterRequest {
    user: string;
    password: string;
    confirmPassword?: string;
    email?: string;
}

interface UseRegisterReturn {
    register: (credentials: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
    isLoading: boolean;
    error: string | null;
}

export const useRegister = (): UseRegisterReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (credentials: RegisterRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implementar chamada para API de registro
            console.log('Register credentials:', credentials);

            // Por enquanto, retorna erro pois não há API
            setError('Funcionalidade de registro ainda não implementada');
            return { success: false, error: 'Funcionalidade de registro ainda não implementada' };

        // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        isLoading,
        error,
    };
};
