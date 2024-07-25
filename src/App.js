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
import { auth, googleProvider } from './firebase/firebase'; //파이어베이스 구글인증
import { signInWithPopup, signOut } from "firebase/auth"; // Firebase 함수 임포트
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './userSlice';
import useAuth from "./useAuth";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;


export default () => {
  const dispatch = useDispatch();

  useAuth();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken(); // ID 토큰 가져옴
      await axios.post('http://127.0.0.1:8000/verify-token', { idToken }); //토큰을 서버로 전송
      dispatch(setUser(result.user));
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };


  const signOutUser = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage signInWithGoogle={signInWithGoogle} signOut={signOutUser} />} />
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

