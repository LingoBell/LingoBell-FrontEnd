import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import Main from "./components/atomic/pages/Main";
import Layout from "./components/layout";
import IndexPage from "./components/atomic/pages/IndexPage";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Header from "./components/layout/Header";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
export default () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path='/chat-history' element={<ChatHistory />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/test" element={Header}></Route>

        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

