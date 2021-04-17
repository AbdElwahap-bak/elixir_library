import { all } from "redux-saga/effects";
import general from "./general";

export default function* rootSaga() {
  yield all([...general]);
}
