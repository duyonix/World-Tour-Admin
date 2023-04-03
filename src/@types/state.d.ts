interface State {
  loading: boolean;
  data: any;
  error: string;
}

interface AuthState {
  loading: boolean;
  isLogin: boolean;
  token: string;
  user: any;
  message: string;
  role: string;
}
