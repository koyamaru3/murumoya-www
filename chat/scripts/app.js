import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyD52HjV8EAdlZkgH2xQO_gcB6nNjopYoLk",
  authDomain: "murumoya-chat.firebaseapp.com",
  databaseURL: "https://murumoya-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "murumoya-chat",
  storageBucket: "murumoya-chat.appspot.com",
  messagingSenderId: "615727849644",
  appId: "1:615727849644:web:f63e902f4ff60181fcbf09",
  measurementId: "G-75H1LXNQ7T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);