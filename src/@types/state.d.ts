interface State {
  loading: boolean;
  data: any;
  error: string;
}

interface AuthState {
  isLogin: boolean;
  token: string;
  user: any;
  message: string;
  role: string;
}
