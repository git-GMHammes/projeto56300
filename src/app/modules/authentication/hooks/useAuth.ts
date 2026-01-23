import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authApi } from '../services/authApi';
import { tokenService } from '../services/tokenService';
import { LoginRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state: any) => state.auth,
  );

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());

      const response = await authApi.login(credentials);

      if (response.status === 'success') {
        // Garantir que data tem a estrutura correta
        const loginData = response.data as {
          user: {
            id: string;
            user: string;
            last_login: string;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
          };
          token: string;
        };

        // Salva token e usuário
        await tokenService.saveToken(loginData.token);
        await tokenService.saveUser(loginData.user);

        dispatch(
          loginSuccess({
            user: loginData.user,
            token: loginData.token,
          }),
        );

        return { success: true };
      } else {
        // Trata erros da API
        let errorMessage = response.message;

        // Se há erros de validação, pega o primeiro
        if (response.data && typeof response.data === 'object' && 'validation' in response.data) {
          const validationData = response.data as { validation: Record<string, string> };
          const firstValidationError = Object.values(validationData.validation)[0];
          if (firstValidationError) {
            errorMessage = firstValidationError;
          }
        }

        dispatch(loginFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
    // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Erro de conexão. Tente novamente.';

      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Remove dados do storage
    tokenService.removeToken();
    tokenService.removeUser();

    // Atualiza estado
    dispatch({ type: 'auth/logout' });
  };

  return {
    login,
    logout,
    isAuthenticated,
    user,
    loading,
    error,
  };
};