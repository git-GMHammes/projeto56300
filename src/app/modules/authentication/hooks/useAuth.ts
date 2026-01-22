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

      const response = await authApi.login(credentials.user, credentials.password);

      if (response.status === 'success') {
        // Salva token e usuário
        await tokenService.saveToken(response.data.token);
        await tokenService.saveUser(response.data.user);

        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        );

        return { success: true };
      } else {
        // Trata erros da API
        const errorMessage = response.data?.validation
          ? (Object.values(response.data.validation)[0] as string)
          : response.message;

        dispatch(loginFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
    // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      const errorMessage = `Erro de conexão: ${error}. Tente novamente.`;
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage }
    }
  };

  return {
    login,
    isAuthenticated,
    user,
    loading,
    error,
  };
};