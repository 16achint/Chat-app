/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyAZTsnGpJU841ZCMaR20sX0v-rvMFI33bU',
  authDomain: 'chat-web-app-623d5.firebaseapp.com',
  projectId: 'chat-web-app-623d5',
  storageBucket: 'chat-web-app-623d5.appspot.com',
  messagingSenderId: '689850280386',
  appId: '1:689850280386:web:b7ad2483efeb8ef26e8e5b',
});

firebase.messaging();

// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

// const firebaseApp = initializeApp({
//     apiKey: 'AIzaSyAZTsnGpJU841ZCMaR20sX0v-rvMFI33bU',
//     authDomain: 'chat-web-app-623d5.firebaseapp.com',
//     projectId: 'chat-web-app-623d5',
//     storageBucket: 'chat-web-app-623d5.appspot.com',
//     messagingSenderId: '689850280386',
//     appId: '1:689850280386:web:b7ad2483efeb8ef26e8e5b',
//   });

// const messaging = getMessaging(firebaseApp);
