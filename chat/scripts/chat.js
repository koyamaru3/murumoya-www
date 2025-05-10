import { app } from './app.js';
import { getDatabase, get, set, ref, push, remove, child, onChildAdded, onChildRemoved } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getDateString, getDateStringForChat, sanitize } from './common.js';

const db = getDatabase(app);

// チャットの最大表示行数
const max_lines = 100;

// クエリ文字列を取得する
const searchParams = new URLSearchParams(window.location.search);
const room = searchParams.get('room');
const name = searchParams.get('name');
const color = searchParams.get('color');
const face = searchParams.get('face');
const id = searchParams.get('id');
let members = [];

document.addEventListener('DOMContentLoaded', () => {

  // 画面に名前を表示する
  // 参加者として登録されていなかったらエラーにする
  document.getElementById('chat_name').innerHTML = `<span style="color: ${color}">${name}</span> <span id="chat_exit">退出</span>`;
  document.getElementById('chat_exit').addEventListener('click', () => exitChat());

  // 自分のアイコンを表示する
  document.getElementById('chat_face').innerHTML = `<img src="./images/faces/${face}.png">`;

  // テキストボックスでエンター入力されたら送信する
  document.getElementById('chat_message').addEventListener('keypress', (e) => {if (e.code === 'Enter') addMessage();});

  // 送信ボタンが押されたら送信する
  document.getElementById('chat_send').addEventListener('click', () => addMessage());
    
  // ルーム情報を読み込んで表示する
  get(ref(db, `rooms/${room}`)).then(data => {
    document.getElementById('chat_title').innerHTML = `${data.val().name}`;
  })
  .catch(error => {
    document.getElementById('chat_container').innerHTML = "指定したルームは使用できません。";
  });

  // idが有効か確認する
  get(ref(db, `rooms/${room}/members/${name}`)).then(data => {
    if (data.exists() && data.val().id == id) {}
    else {
      document.getElementById('chat_container').innerHTML = "そのユーザはすでに入室中です。";
    }
  })
  .catch(error => {
    document.getElementById('chat_container').innerHTML = "DBアクセスエラーが発生しました。";
  });

});

// RealtimeDatabaseに書き込む
function addMessage() {
  let message = document.getElementById('chat_message').value;
  if (message == "" || message == null) return;

  // チャットが有効化状態の場合に発言を書き込む
  get(ref(db, `rooms/${room}/status`)).then(data => {
    if (data.exists() && data.val() == 'open') {
      message = sanitize(message);
      if (message.length > 128) message = message.substr(0, 128);
    
      push(child(ref(db), `messages/${room}`), {
        name: name,
        message: message,
        color: color,
        face: face,
        date: getDateStringForChat(new Date())
      });
    
      // 現在日の文字列を作成する
      const dateString = getDateString(new Date());
    
      // 最終発言日時を更新する
      set(child(ref(db), `rooms/${room}/members/${name}`), {
        id: id,
        date: dateString
      });
    }
    document.getElementById('chat_message').value = '';
  });
}

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

  // 一番下までスクロールされていれば追加後も一番下までスクロールする
  if (isScrollBottom(panel)) {
    panel.innerHTML += str;
//    scrollToBottom(panel);
    window.setTimeout(() => {scrollToBottom(panel)}, 500);
  }
  // 一番下までスクロールされていなければスクロールしない
  else {
    panel.innerHTML += str;
  }
  if (panel.children.length > max_lines) panel.removeChild(panel.children[0]);
});

// RealtimeDatabaseからメンバー情報を取得する
onChildAdded(ref(db, `rooms/${room}/members`), (snapshot) => {
  const header = document.getElementById('chat_header2');
  const k = snapshot.key;
  members.push(k);
  header.innerHTML += `[${k}] `;
});

onChildRemoved(ref(db, `rooms/${room}/members`), (snapshot) => {
  const header = document.getElementById('chat_header2');
  const k = snapshot.key;
  let str = "";
  members = members.filter(member => member != k);
  members.map(member => str += `[${member}] `);
  header.innerHTML = str;
});

// チャットから退出する
function exitChat() {
  push(child(ref(db), `messages/${room}`), {
    info: `${name} が退出しました。`,
    date: getDateStringForChat(new Date())
  })
  remove(child(ref(db), `rooms/${room}/members/${name}`));
  window.location.href = `./exit.html`;
}

// 下までスクロールする
function scrollToBottom(obj) {
  obj.scrollTop = obj.scrollHeight;
}
    
// 一番下までスクロールしているかどうか
function isScrollBottom(obj) {
  return obj.scrollHeight === obj.scrollTop + obj.offsetHeight;
}
