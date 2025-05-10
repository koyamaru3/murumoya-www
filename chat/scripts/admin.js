import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, update, get, push, child } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { app } from './app.js';

const auth = getAuth();
const db = getDatabase(app);

// 現在ログインしているユーザを取得する
onAuthStateChanged(auth, user => {
  if (user) {
    // ログイン中ユーザありの場合、フォーム入力をスキップする
    document.getElementById('admin_form').innerHTML = "";
    menu();
    const uid = user.uid;
    console.log(uid)
    console.log(auth.currentUser);
  } else {
    form();
    document.getElementById('admin_read').innerHTML = "";
    document.getElementById('admin_nayose').innerHTML = "";
    document.getElementById('admin_logout').innerHTML = "";
    document.getElementById('admin_add').innerHTML = "";
  }
});

function login() {
  const mailAddress = document.getElementById('admin_mailaddress').value;
  const password = document.getElementById('admin_password').value;
  
  signInWithEmailAndPassword(auth, mailAddress, password)
  .then(() => {
  })
  .catch(error => {
    console.log(error)
    alert('ログインできません（' + error.message + '）');
  });
}

function form() {
  const str =
    `<div>メールアドレス<input id="admin_mailaddress" type="mailAddress" required/></div>` +
    `<div>パスワード<input id="admin_password" type="password" required/></div>` +
    `<input type="button" class="admin_button" name="login" value="ログイン">`;
  document.getElementById('admin_form').innerHTML = str;

  // ボタンにイベントを設定する
  const read = document.querySelectorAll("input.admin_button");
  for (let i = 0; i < read.length; i++) {
    read[i].addEventListener('click', onClick);
  }
}

function menu() {

  document.getElementById('admin_read').innerHTML = "";

  get(ref(db, `rooms`)).then(snapshot => {

    // ルーム情報を取得する
    const rooms = snapshot.val() != null
      ? Object.keys(snapshot.val())
      : null;

    rooms != null && rooms.map(room => {
      const checked = snapshot.val()[room].status == 'open' ? ' checked' : '';
      document.getElementById('admin_read').innerHTML += `<div class="enter_name">${snapshot.val()[room].name}<br>` +
      `<input id="${room}_enable" name="${room}" class="admin_check" type="checkbox"${checked}>` +
      `<input id="${room}_read" name="${room}" class="admin_button" type="button" value="閲覧する"></div>`;

      // チェックボックスにイベントを設定する
      const chk = document.querySelectorAll("input.admin_check");
      for (let i = 0; i < chk.length; i++) {
        chk[i].addEventListener('change', updateRoom);
      }

      // ボタンにイベントを設定する
      const read = document.querySelectorAll("input.admin_button, input.admin_nayose_button");
      for (let i = 0; i < read.length; i++) {
        read[i].addEventListener('click', onClick);
      }
    });
  });

  // ルーム追加ボタンを表示する
  document.getElementById('admin_add').innerHTML = `<label for="admin_roomname">ルーム名</label> <input id="admin_roomname" name="admin_roomname" required/>  <input type="button" class="admin_button" name="add" value="ルーム追加">`;

  // 名寄せボタンを表示する
  document.getElementById('admin_nayose').innerHTML = `<input type="button" class="admin_nayose_button" name="nayose" value="参加者を名寄せする">`;

  // ログアウトボタンを表示する
  document.getElementById('admin_logout').innerHTML = `<input type="button" class="admin_button" name="logout" value="ログアウト">`;
}

// チェックボックスを処理する
function updateRoom(event) {
  const newStatus = event.target.checked == true ? 'open' : 'close';
  update(ref(db, `rooms/${event.target.name}`), {
    status: newStatus
  });
}

// ボタンを処理する
function onClick(event) {
  if (event.target.name == 'login') {
    login();
  }
  else if (event.target.name == 'logout') { 
    auth.signOut();
  }
  else if (event.target.name == 'nayose') {
    window.open(`./admin_nayose.html`);
  }
  else if (event.target.name == 'add') {
    const room = document.getElementById('admin_roomname').value;
    const roomId = new Date().getTime();
    push(ref(db, `rooms`), {
      name: room,
      status: "close"
    });
    menu();
  }

  // 閲覧ボタンの場合
  else {
    window.open(`./admin_read.html?room=${event.target.name}`);
  }
}