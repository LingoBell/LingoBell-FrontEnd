import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import Main from "./components/atomic/pages/Main";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
export default () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route element={<Layout />}> */}
          <Route path="/" element={<Main />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

