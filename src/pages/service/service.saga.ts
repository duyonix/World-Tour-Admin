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

function* getRegionOptions() {
  const serviceService = new ServiceService();
  const res = yield call(serviceService.region.getRegionOptions);
  if (res?.status === variables.OK) {
    yield put(serviceActions.getRegionOptionsSuccess(res.payload));
  } else {
    yield put(serviceActions.getRegionOptionsError("Get region options error"));
  }
}

export default function* serviceSaga() {
  yield takeLatest(serviceActions.getCategoryOptions.type, getCategoryOptions);
  yield takeLatest(serviceActions.getRegionOptions.type, getRegionOptions);
}
