import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
const config = {
  apiKey: 'AIzaSyAZTsnGpJU841ZCMaR20sX0v-rvMFI33bU',
  authDomain: 'chat-web-app-623d5.firebaseapp.com',
  projectId: 'chat-web-app-623d5',
  storageBucket: 'chat-web-app-623d5.appspot.com',
  messagingSenderId: '689850280386',
  appId: '1:689850280386:web:b7ad2483efeb8ef26e8e5b',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
