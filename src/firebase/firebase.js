// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import 'firebase/auth';

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
