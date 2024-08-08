// src/firebase.js
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
export const messaging = async () => await isSupported() && getMessaging(app)

export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const messagingInstance = await messaging();
            const token = await getToken(messagingInstance, { vapidKey: 'BMhXcBGgHNqR-5tATwB7zEOwmVjw8Bi-vZGUoYvUwJJJvG406y_0OWEtEaiIEeaASuqlBEscwViVlBGJP-sIi_A' });
            console.log('FCM Token:', token);
            onMessage(messagingInstance, (payload) => {
                console.log('Message received', payload);
                // 여기서 알림 커스터마이징
                if (payload.notification) {
                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                        body: payload.notification.body,
                    };
                    console.log('Creating notification:', notificationTitle, notificationOptions);
                    // Check if Notifications are supported and display the notification
                    if ('Notification' in window) {
                        console.log('hihi')
                        new Notification(notificationTitle, notificationOptions);
                    } else {
                        console.log('Notifications not supported in this browser.');
                    }
                } else {
                    console.log('No notification payload found in the message.');
                }
            });
        } else {
            console.log('Notification permission denied');
        }
    } catch (error) {
        console.log('Error getting permission for notifications', error);
    }
};

requestPermission();

