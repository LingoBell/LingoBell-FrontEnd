import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import ProfileCard_Test from "./components/atomic/pages/ProfileCard_Test";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
export default () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route>
          <Route path="/" element={<ProfileCard_Test />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

