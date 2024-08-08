
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');


const firebaseConfig = {
  'apiKey': "AIzaSyAfXBd6KqRqNPGkk3vdq71IRC_aJGJxYbw",
  'authDomain': "lingobell-c87d8.firebaseapp.com",
  'projectId': "lingobell-c87d8",
  'storageBucket': "lingobell-c87d8.appspot.com",
  'messagingSenderId': "934803059111",
  'appId': "1:934803059111:web:c4456846fb5f0eb35c0682",
  'measurementId': "G-YJ22Q6VWRJ",
};


firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('hoo1')

  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  console.log('hoo2')

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  console.log('hoo')
});
