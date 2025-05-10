import { app } from './app.js';
import { digestMessage, getDateString, getDateStringForChat, sanitize } from './common.js';
import { getDatabase, ref, set, push, child, onChildAdded, onChildChanged, get } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const db = getDatabase(app);

//受信処理
onChildAdded(ref(db, 'rooms'), (snapshot) => {
  const v = snapshot.val();
  const k = snapshot.key;
  let str = "";
  if (v.status == 'open') {
    // 参加者情報を取得する
    get(ref(db, `rooms/${k}/members`)).then((snapshot) => {
      const members = snapshot.val() != null
        ? Object.keys(snapshot.val())
        : null;

      const element = document.createElement('div');
      element.className = 'enter_name';
      element.id = `div_${k}`;
      const output = document.getElementById('rooms').appendChild(element);
      console.log(k)

      str += `${v.name}<br>`;
      str += `<input id="${k}" class="entrance_enter" type="button" value="入室する">`;
      str += '<div class="entrance_member">';
      members != null && members.map(member => str += `[${member}] `);
      str += '</div>';
      output.innerHTML = str;

      document.getElementById(`${k}`).addEventListener('click', enterRoom, false);
    });
  }
});

//受信処理
onChildChanged(ref(db, 'rooms'), (snapshot) => {
  const v = snapshot.val();
  const k = snapshot.key;
  let str = "";
  const element = document.getElementById(`div_${k}`);

  if (v.status == 'close' && element != null) {
    element.remove();
  }

  if (v.status == 'open' && element == null) {
    // 参加者情報を取得する
    get(ref(db, `rooms/${k}/members`)).then((snapshot) => {
      const members = snapshot.val() != null
        ? Object.keys(snapshot.val())
        : null;

      const element = document.createElement('div');
      element.className = 'enter_name';
      element.id = `div_${k}`;
      const output = document.getElementById('rooms').appendChild(element);
      console.log(k)

      str += `${v.name}<br>`;
      str += `<input id="${k}" class="entrance_enter" type="button" value="入室する">`;
      str += '<div class="entrance_member">';
      members != null && members.map(member => str += `[${member}] `);
      str += '</div>';
      output.innerHTML = str;

      document.getElementById(`${k}`).addEventListener('click', enterRoom, false);
    });
  }

});

function enterRoom(event) {
  let name = document.getElementById('entrance_name').value;
  const faces = document.getElementsByName('face');
  const face = [...faces].find(face => face.checked).value;
  const colors = document.getElementById('entrance_color');
  const notice = document.getElementById('entrance_notice');
  const color = colors.value;

  const room = event.target.id;

  // 名前が未入力なら入室させない
  if (name == "" || name == null) {
    notice.innerHTML = "名前を入力してください。";
    return;
  }

  // 名前をサニタイズ処理する
  name = sanitize(name);

  // 名前の文字数チェック
  if (name.length > 20) name = name.substr(0, 20);

  // 現在日の文字列を作成する
  const dateString = getDateString(new Date());
  
  // 名前のIDを作成する
  digestMessage(name + dateString).then(shatxt => {
    get(ref(db, `rooms/${room}/members/${name}`)).then(data => {
      if (data.exists()) {
        // すでに別のユーザが入室中の場合
        notice.innerHTML = "その名前は使用されています。";
      } else {
        // 入室中ユーザに含まれていないため、入室中ユーザに追加して入室する
        set(child(ref(db), `rooms/${room}/members/${name}`), {
          id: shatxt,
          date: dateString
        });
        push(child(ref(db), `messages/${room}`), {
          info: `${name} が入室しました。`,
          date: getDateStringForChat(new Date())
        })

        window.location.href = `./chat.html?room=${room}&name=${name}&color=${color}&face=${face}&id=${shatxt}`;
      }
    })
    .catch(error => {
      // DBアクセスエラー
      notice.innerHTML = "情報取得エラーです。";
    });
  })
  .catch(error => {
    notice.innerHTML = "情報取得エラーです。";
  });
}


