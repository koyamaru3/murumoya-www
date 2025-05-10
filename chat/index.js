import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getDatabase, ref, push, child, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

let room = "chat_room";
const send = document.getElementById("send");
const name = document.getElementById("name");
const message = document.getElementById("message");
const output = document.getElementById("output");
const dbref = ref(db, room);

//送信処理
send.addEventListener('click', () => {
    const now = new Date();
    push(child(ref(db), room), {
        name: name.value,
        message: message.value,
        date: now.getFullYear() + '年' + now.getMonth()+1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
    })
    message.value="";
    name.value="";
});


//受信処理
onChildAdded(dbref, (snapshot) => {
    console.log(snapshot);
    const v = snapshot.val();
    const k = snapshot.key;
    let str = "";
    str += '<div class="name">名前：'+v.name+'</div>';
    str += '<div class="text">日時：'+v.date+'</div>';
    str += '<div class="text">メッセージ：'+v.message+'</div><hr>';
    output.innerHTML += str;
});