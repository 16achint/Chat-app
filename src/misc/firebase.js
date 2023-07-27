import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
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
export const storage = app.storage();
export const messageing = firebase.messaging.isSupported()
  ? app.messaging()
  : null;

if (messageing) {
  messageing.usePublicVapidKey(
    'BGwqAb_5soMWQmnpLrye4Guv74Wqj5jk9FqGBl2GZLl4FuU8EJgKEr0OLmtcF1ARd9tpnPyYwyNMZ6IOC5CQZwc'
  );
  messageing.onMessage(data => {
    console.log(data);
  });
}
