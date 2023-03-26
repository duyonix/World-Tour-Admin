import { put, call, takeLatest, all } from "redux-saga/effects";
import AuthService from "@/services/auth";
import { authActions } from "./auth.slice";
import messages from "@/constants/messages";
import _ from "lodash";

function* login(action: any) {}

export function* authSaga() {
  yield all([takeLatest(authActions.login.type, login)]);
}
