import {
  Action,
  configureStore,
  ThunkAction,
  getDefaultMiddleware
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
    sagaMiddleware
  ],
  devTools: process.env.NODE_ENV !== "production"
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
