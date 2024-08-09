importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  'apiKey': "AIzaSyAfXBd6KqRqNPGkk3vdq71IRC_aJGJxYbw",
  'authDomain': "lingobell-c87d8.firebaseapp.com",
  'projectId': "lingobell-c87d8",
  'storageBucket': "lingobell-c87d8.appspot.com",
  'messagingSenderId': "934803059111",
  'appId': "1:934803059111:web:c4456846fb5f0eb35c0682",
  'measurementId': "G-YJ22Q6VWRJ",
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});