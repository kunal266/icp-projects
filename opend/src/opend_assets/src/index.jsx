import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Principal } from "@dfinity/principal";
const CURRENT_USER_ID = Principal.fromText("ykvla-ejb7f-7gijm-lfz7y-2fawj-eug3t-bd2jb-sndel-yalyd-r67j6-iae")
export default CURRENT_USER_ID
const init = async () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

init();
