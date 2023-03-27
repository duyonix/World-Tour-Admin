import { put, call, takeLatest, all } from "redux-saga/effects";
import AuthService from "@/services/auth";
import { authActions } from "./auth.slice";
import messages from "@/constants/messages";
import _ from "lodash";
import { toast } from "react-toastify";

function* login(action: any) {
  const authService = new AuthService();
  const res = yield call(authService.login, action.payload);
  if (res?.status === "OK") {
    localStorage.setItem("access_token", res.payload.token);
    localStorage.setItem("user_id", res.payload.user.id);
    localStorage.setItem("user_role", res.payload.user.role);
    yield put(authActions.loginSuccess(res.payload));

    toast.success(messages.LOGIN_SUCCESS);
  } else {
    toast.error(messages.LOGIN_ERROR);
    yield put(authActions.loginError({ message: messages.LOGIN_ERROR }));
  }
}

export function* authSaga() {
  yield all([takeLatest(authActions.login.type, login)]);
}
