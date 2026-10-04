importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-whPB4HLBA_FZkYr5OtmJRR7ofXs_s_0",
  authDomain: "bwhnew.firebaseapp.com",
  projectId: "bwhnew",
  storageBucket: "bwhnew.firebasestorage.app",
  messagingSenderId: "822224776722",
  appId: "1:822224776722:web:ad39bec266c20a6622b2cb"
});

const messaging = firebase.messaging();

// Berichten opvangen op de achtergrond (wanneer de app gesloten is)
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification ? payload.notification.title : "Brandweer App";
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : "Er is een nieuwe melding.",
    icon: './icon-192.png',
    badge: './icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
