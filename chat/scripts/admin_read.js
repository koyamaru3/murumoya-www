import { app } from './app.js';
import { getDatabase, get, ref, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const db = getDatabase(app);

// クエリ文字列を取得する
const searchParams = new URLSearchParams(window.location.search);
const room = searchParams.get('room');

document.addEventListener('DOMContentLoaded', () => {

  // ルーム情報を読み込んで表示する
  get(ref(db, `rooms/${room}`)).then(data => {
    document.getElementById('chat_title').innerHTML = `${data.val().name}`;
  })
  .catch(error => {
    console.log(error);
    //document.getElementById('chat_container').innerHTML += "読み込みエラーが発生しました。";
  });
});

// RealtimeDatabaseからメッセージ情報を取得する
onChildAdded(ref(db, `messages/${room}`), (snapshot) => {
  const panel = document.getElementById('chat_panel');
  const v = snapshot.val();
  const k = snapshot.key;
  let str = "";

  if (v.info != undefined) {
    str += `<div class="talk">${v.info} <span class="date">(${v.date})</span></div>`;
  
  } else {
    str += `<div class="talk">`;
    str += `<div class="talk_face"><img src="images/faces/${v.face}.png"></div>`;
    str += `<p class="talk_message" style="color: ${v.color}"><span class="talk_member">${v.name}</span>：${v.message} <span class="date">(${v.date})</span></p></div>`
  }
  panel.innerHTML += str;
});
