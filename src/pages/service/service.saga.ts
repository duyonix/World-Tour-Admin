import { put, call, takeLatest } from "redux-saga/effects";
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
      serviceActions.getCategoryOptionsError("Lấy danh sách phân loại thất bại")
    );
  }
}

function* getRegionOptions(params: any) {
  const serviceService = new ServiceService();
  const res = yield call(serviceService.region.getRegionOptions, params);
  if (res?.status === variables.OK) {
    yield put(serviceActions.getRegionOptionsSuccess(res.payload));
  } else {
    yield put(
      serviceActions.getRegionOptionsError("Lấy danh sách địa danh thất bại")
    );
  }
}

export default function* serviceSaga() {
  yield takeLatest(serviceActions.getCategoryOptions.type, getCategoryOptions);
  yield takeLatest(serviceActions.getRegionOptions.type, getRegionOptions);
}
