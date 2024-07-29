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
import { auth, googleProvider } from './firebase/firebase'; //파이어베이스 구글인증
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"; // Firebase 함수 임포트
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setProcessFinished } from './redux/userSlice';
import useAuth from "./useAuth";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Video from "./components/atomic/pages/Video";
// export let mainDomain = 'http://localhost:8000'

export let mainDomain = ''
// mainDomain = ''
//  mainDomain
axios.defaults.baseURL = mainDomain;
axios.defaults.headers.common.Authorization = 'JHKIM';

export default () => {
  const dispatch = useDispatch();

  const { user, processFinished } = useSelector((state) => {
    return { user: state.user?.user, processFinished: state.user.processFinished }
  })

  React.useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(user){

        dispatch(setUser(JSON.parse(JSON.stringify(user))))
      } else {
        dispatch(clearUser ());
      }
      dispatch(setProcessFinished())
    });
    return()=> unsubscribe();
  }, [dispatch]);
  if (!processFinished) {
    return null
  }
  const isLoginUser = !!user
  // if (pending) {
  //   return null
  // }
  if (!isLoginUser) {
    return (
      <IndexPage />
    )
    // return (
    //   <BrowserRouter>
    //     <Routes>
    //       <Route element={<Layout />}>
    //         <Route path="/" element={<IndexPage />} />
    //         {/* <Route path='/chat-history' element={<ChatHistory />} />
    //         <Route path="/Main" element={<Main />} />
    //         <Route path="/chat" element={<ChatForm />} />
    //         <Route path="/liveChat" element={<LiveChat />} />
    //         <Route path="/test" element={Header}></Route> */}
    //       </Route>
    //     </Routes>
        
    //   </BrowserRouter>
    // )
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* <Route path="/" element={<IndexPage signInWithGoogle={signInWithGoogle} signOut={signOutUser} />} /> */}
          <Route path='/' element={<ChatHistory />} />
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

