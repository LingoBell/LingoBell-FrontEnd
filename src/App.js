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
import { setUser, clearUser, setProcessFinished, checkFirstLogin } from './redux/userSlice';
import useAuth from "./useAuth";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Video from "./components/atomic/pages/Video";
import ProfilePage from "./components/atomic/pages/ProfilePage";


export let mainDomain = 'http://localhost:8000'
axios.defaults.baseURL = mainDomain + "/api" //api엔드포인트 defualtUrl설정
axios.defaults.withCredentials = true;
// axios.defaults.headers.common.Authorization = window.localStorage.getItem('AUTH_USER')


window.accessToken = null

export default () => {
  const dispatch = useDispatch();

  const { user, processFinished, isFirstLogin } = useSelector((state) => {
    return { 
      user: state.user?.user, 
      processFinished: state.user.processFinished,
      isFirstLogin: state.user.isFirstLogin
    }
  })

  React.useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if(user){

        const accessToken  = user.accessToken
        
        const STORAGE_TOKEN = window.localStorage.getItem('AUTH_USER')
        axios.defaults.headers.common.Authorization = STORAGE_TOKEN || 'Bearer ' + user.accessToken
//         axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        console.log(accessToken)
        dispatch(checkFirstLogin())
        /**
         *  1. 누군가가 구글 로그인(프론트)
         *  2. 최초 접속인지 여부 판단(서버: user 테이블에 정보가 있는지를 기준으로, userslice에 작성 checkFirstLogin)
         *  3. 최초 접속인 경우 프로필 페이지만 보여준다(ProfilePage 작성 필요)
         * 
         * */ 
        

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
  }
  const renderRoutes = () => {
    console.log('test',isFirstLogin)
    if (isFirstLogin == 3) {
      return (
        <Route path='*' element={<ProfilePage/>}/>
      )
    }
    if(isFirstLogin == 2){
    return (
      <>
        {/* <Route path="/" element={<IndexPage signInWithGoogle={signInWithGoogle} signOut={signOutUser} />} /> */}
        <Route path='/' element={<ChatHistory />} />
        <Route path='/chat-history'>
          <Route path=':chatId' element={<ChatHistory />} />
          <Route path='' element={<ChatHistory />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/partners' element={<ProfileList />} />
        <Route path="/Main" element={<Main />} />
        {/* <Route path='/live-chat/:chatSessionId' element={LiveChat} /> */}
        <Route path="/chat" element={<ChatForm />} />
        <Route path="/live-chat/:chatId" element={<LiveChat />} />
        <Route path="/test" element={Header}></Route>
        <Route path='/video' element={<Video />} />
      </>
    )
    }
}
  


  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {renderRoutes()}

        </Route>
      </Routes>
      
    </BrowserRouter>
  )
}

