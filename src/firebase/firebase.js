import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { getDatabase, onValue, ref } from 'firebase/database';
import { registerFcm } from '../apis/UserAPI';


const firebaseConfig = {
    'apiKey': "AIzaSyAfXBd6KqRqNPGkk3vdq71IRC_aJGJxYbw",
    'authDomain': "lingobell-c87d8.firebaseapp.com",
    'projectId': "lingobell-c87d8",
    'storageBucket': "lingobellstorage.appspot.com",
    'messagingSenderId': "934803059111",
    'appId': "1:934803059111:web:c4456846fb5f0eb35c0682",
    'measurementId': "G-YJ22Q6VWRJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app)
export const database = getDatabase(app); // Realtime Database 초기화



// FCM 토큰 생성 및 등록
export const generateToken = async () => {
   const permission =  await Notification.requestPermission()
   console.log(permission)
   if(permission === 'granted'){

       const token = await getToken(messaging, {
        vapidKey : 'BMhXcBGgHNqR-5tATwB7zEOwmVjw8Bi-vZGUoYvUwJJJvG406y_0OWEtEaiIEeaASuqlBEscwViVlBGJP-sIi_A'
       })
       console.log(token)
       registerFcm(token) // db에 토큰 저장
       
   } else if(permission == 'denied') {
    alert('Notification permission is denied. please activate notification setting to get chat request alarm ');
}
}

// 유저 접속중 유무 판단
export const user_online_status = () => {
    return new Promise((resolve, reject) => {
        try {
            const userRef = ref(database, '/users');
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    resolve(data); // 데이터를 resolve하여 반환
                } else {
                    resolve({}); // 데이터가 없으면 빈 객체를 반환
                }
            }, (error) => {
                reject(error); // 오류가 발생하면 reject
            });
        } catch (error) {
            reject(error);
        }
    });
};
