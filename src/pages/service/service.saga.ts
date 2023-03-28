import { put, call, takeLatest, all } from "redux-saga/effects";
import ServiceService from "@/services/service";
import { serviceActions } from "./service.slice";
import variables from "@/constants/variables";

function* getCategoryOptions() {
  const serviceService = new ServiceService();
  const res = yield call(serviceService.category.getCategoryOptions);
  if (res?.status === variables.OK) {
    yield put(serviceActions.getCategoryOptionsSuccess(res.payload));
  } else {
    yield put(
      serviceActions.getCategoryOptionsError("Get category options error")
    );
  }
}

function* getScopeOptions() {
  const serviceService = new ServiceService();
  const res = yield call(serviceService.scope.getScopeOptions);
  if (res?.status === variables.OK) {
    yield put(serviceActions.getScopeOptionsSuccess(res.payload));
  } else {
    yield put(serviceActions.getScopeOptionsError("Get scope options error"));
  }
}

export default function* serviceSaga() {
  yield takeLatest(serviceActions.getCategoryOptions.type, getCategoryOptions);
  yield takeLatest(serviceActions.getScopeOptions.type, getScopeOptions);
}
