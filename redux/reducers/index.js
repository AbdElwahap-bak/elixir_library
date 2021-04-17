import { combineReducers } from "redux";
import general from "./general";
import viewStatus from "./viewStatus";
import tabs from "./tabs";



export default combineReducers({ general, viewStatus, tabs });
