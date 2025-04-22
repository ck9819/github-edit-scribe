import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
//import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter as Router} from "react-router-dom";

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </Router>,
  document.getElementById("root")
);
