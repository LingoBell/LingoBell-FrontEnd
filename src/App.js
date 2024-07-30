import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import Main from "./components/atomic/pages/Main";
import ChatForm from "./components/atomic/molecules/ChatForm";
import Layout from "./components/layout";
import IndexPage from "./components/atomic/pages/IndexPage";
import ProfileList from "./components/atomic/pages/ProfileList";
import Header from "./components/layout/Header";
import LiveChat from "./components/atomic/pages/LiveChat";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Video from "./components/atomic/pages/Video";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
axios.defaults.headers.common["Authorization"] = 'JWLEE'
export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path='/chat-history'>
            <Route path=':chatId' element={<ChatHistory />} />

            <Route path='' element={<ChatHistory />} />
          </Route>
          <Route path='/partners' element={<ProfileList />} />
          <Route path="/Main" element={<Main />} />
          {/* <Route path='/live-chat/:chatSessionId' element={LiveChat} /> */}
          <Route path="/chat" element={<ChatForm />} />
          <Route path="/live-chat/:chatId" element={<LiveChat />} />
          <Route path="/test" element={Header}></Route>
          <Route path='/video' element={<Video />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

