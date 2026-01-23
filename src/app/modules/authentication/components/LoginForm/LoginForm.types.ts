export interface LoginFormProps {
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
  disabled?: boolean;
  showForgotPassword?: boolean;
  showRegisterLink?: boolean;
}

export interface LoginFormData {
  user: string;
  password: string;
}

export interface LoginFormState {
  user: string;
  password: string;
  isLoading: boolean;
  showPassword: boolean;
}

export interface LoginFormValidation {
  user?: string;
  password?: string;
}