import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from 'axios'
import Main from "./components/atomic/pages/Main";
import ChatForm from "./components/atomic/molecules/ChatForm";
import Layout from "./components/layout";
import IndexPage from "./components/atomic/pages/IndexPage";
import ChatHistory from "./components/atomic/pages/ChatHistory";
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
           <Route path="/chat" element={<ChatForm />} />
          <Route path="/Main" element={<Main />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

