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
import { auth, database, generateToken, googleProvider, messaging, requestPermission } from './firebase/firebase'; //파이어베이스 구글인증
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"; // Firebase 함수 임포트
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setProcessFinished, checkFirstLogin } from './redux/userSlice';
import useAuth from "./useAuth";
import ChatHistory from "./components/atomic/pages/ChatHistory";
import Video from "./components/atomic/pages/Video";
import ProfilePage from "./components/atomic/pages/ProfilePage";
import { onMessage } from "firebase/messaging";
import { registerFcm } from "./apis/UserAPI";
import { UpdateChatRoomStatus } from "./apis/ChatAPI";
import { onDisconnect, onValue, ref, serverTimestamp, set } from "firebase/database";
import STT from "./components/atomic/pages/STT";


export let mainDomain = ''// 'http://localhost:8000'
axios.defaults.baseURL = mainDomain + "/api" //api엔드포인트 defualtUrl설정
axios.defaults.withCredentials = true;

// axios.defaults.headers.common.Authorization = window.localStorage.getItem('AUTH_USER')

window.accessToken = null

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((err) => {
      console.log('Service Worker registration failed:', err);
    });
}


export default () => {
  const dispatch = useDispatch();

  const { user, processFinished, isFirstLogin } = useSelector((state) => {
    return {
      user: state.user?.user,
      processFinished: state.user.processFinished,
      isFirstLogin: state.user.isFirstLogin
    }
  })

  // firebase cloud message
  React.useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('payload', payload)
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
        data: payload.data
      };
      const notification = new Notification(notificationTitle, notificationOptions)

      notification.onclick = async (event) => {
        event.preventDefault();
        try {
          if (notificationOptions.data.chat_room_id) {
            // 주어진 UpdateChatRoomStatus 함수를 사용하여 API 호출
            const data = await UpdateChatRoomStatus(notificationOptions.data.chat_room_id);
            console.log('Chat room status updated:', data);
          }
  
          // API 호출 후 링크로 이동
          if (notificationOptions.data.link) {
            window.open(notificationOptions.data.link, '_blank');
          }
        } catch (error) {
          console.error('Error during API call or navigation:', error);
  
          // 오류가 발생해도 링크로 이동
          if (notificationOptions.data.link) {
            window.open(notificationOptions.data.link, '_blank');
          }
        }
      };
    });
  }, []);


  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // google로그인
        const accessToken = user.accessToken
        const STORAGE_TOKEN = window.localStorage.getItem('AUTH_USER')
        axios.defaults.headers.common.Authorization = STORAGE_TOKEN || 'Bearer ' + user.accessToken
        console.log(accessToken)

        dispatch(checkFirstLogin())
        dispatch(setUser(JSON.parse(JSON.stringify(user))))

        // 유저 접속 상태 관리
        const userStatusDatabaseRef = ref(database, `/users/${user.uid}/status`)
        const isOfflineForDatabase = {
          state : 'offline',
          last_changed : serverTimestamp(),
        }
        const isOnlineForDatabase = {
          state : 'online',
          last_changed : serverTimestamp(),
        };
        const connectedRef = ref(database, '.info/connected');
        onValue(connectedRef, (snapshot) => {
          if(snapshot.val() === false) return;
          
          onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(()=>{
            set(userStatusDatabaseRef, isOnlineForDatabase);
          })
        })
        
      } else {
        dispatch(clearUser());
      }
     await generateToken() // FCM 토큰 요청
      dispatch(setProcessFinished())
    });
    return () => unsubscribe();
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
    console.log('앱FirstLogin값 : ', isFirstLogin)
    if (isFirstLogin == 3) {
      return (
        <Route path='*' element={<ProfilePage />} />
      )
    }
    if (isFirstLogin == 2) {
      return (
        <>
          {/* <Route path="/" element={<IndexPage signInWithGoogle={signInWithGoogle} signOut={signOutUser} />} /> */}
          <Route path="/" element={<ChatHistory/>}>
          <Route path='/chat-history'>
            <Route path=':chatId' element={<ChatHistory />} />
            <Route path='' element={<ChatHistory />} />
          </Route>
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path='/partners' element={<ProfileList />} />
          <Route path="/Main" element={<Main />} />
          {/* <Route path='/live-chat/:chatSessionId' element={LiveChat} /> */}
          <Route path="/chat" element={<ChatForm />} />
          <Route path="/live-chat/:chatId" element={<LiveChat />} />
          <Route path="/test" element={Header}></Route>
          <Route path='/video' element={<Video />} />
          <Route path='/stt' element={<STT />} />
        </>
      )
    }
    return null; //비정상적으로 isFirstLogin()값이 업데이트 안될 경우 처리하기 위함
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

