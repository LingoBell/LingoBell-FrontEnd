import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    'apiKey': "AIzaSyAfXBd6KqRqNPGkk3vdq71IRC_aJGJxYbw",
    'authDomain': "lingobell-c87d8.firebaseapp.com",
    'projectId': "lingobell-c87d8",
    'storageBucket': "lingobell-c87d8.appspot.com",
    'messagingSenderId': "934803059111",
    'appId': "1:934803059111:web:c4456846fb5f0eb35c0682",
    'measurementId': "G-YJ22Q6VWRJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app)

export const generateToken = async () => {
   const permission =  await Notification.requestPermission()
   console.log(permission)
   if(permission === 'granted'){

       const token = await getToken(messaging, {
        vapidKey : 'BMhXcBGgHNqR-5tATwB7zEOwmVjw8Bi-vZGUoYvUwJJJvG406y_0OWEtEaiIEeaASuqlBEscwViVlBGJP-sIi_A'
       })
       console.log(token)
   }
}


