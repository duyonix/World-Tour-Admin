import { all } from "redux-saga/effects";
import authSaga from "@/pages/auth/auth.saga";
import serviceSaga from "@/pages/service/service.saga";

export default function* rootSaga() {
  yield all([authSaga(), serviceSaga()]);
}
