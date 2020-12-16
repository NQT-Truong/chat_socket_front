import React from "react";
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import 'antd/dist/antd.css';
import './Assets/scss/_app.scss';
import 'bootstrap/dist/css/bootstrap-grid.css';

import Routes from "./Routes/Routes";
import {Provider} from "react-redux";

import {store} from "./Redux/Store";

function App() {
  return (
      <Provider store={store}>
        <Routes/>
      </Provider>
  );
}

export default App;
