import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import Main from "./components/atomic/pages/Main";
import ChatForm from "./components/atomic/molecules/ChatForm";
import Layout from "./components/layout";
import IndexPage from "./components/atomic/pages/IndexPage";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Header from "./components/layout/Header";
import LiveChat from "./components/atomic/pages/LiveChat";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
export default () => {
  console.log('test')
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path='/chat-history' element={<ChatHistory />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/chat" element={<ChatForm />} />
          <Route path="/liveChat" element={<LiveChat />} />
          <Route path="/test" element={Header}></Route>
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

