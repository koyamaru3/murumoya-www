import { app } from './app.js';
import { getDatabase, get, ref, remove } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';
import { getDateString } from './common.js';

const db = getDatabase(app);

// 最終発言からユーザを削除する際の経過時間(ミリ秒)
const timeout = 300 * 1000;

// 名寄せの実行間隔(秒)
const reflesh = 60;

document.addEventListener('DOMContentLoaded', () => {
  nayose();
  setInterval(nayose, reflesh * 1000);
});

function nayose() {
  // ルーム一覧を作成する
  get(ref(db, `rooms`)).then(snapshot => {

    // ルーム情報を取得する
    const rooms = snapshot.val() != null
      ? Object.keys(snapshot.val())
      : null;

    // ルームの数分、名寄せを繰り返す
    rooms != null && rooms.map(room => {

      // ルームのメンバ情報を取得する
      const members = snapshot.val()[room].members != null
        ? Object.keys(snapshot.val()[room].members)
        : null;

      // メンバがタイムアウトしているかチェックする
      members != null && members.map(member => {
        const date = Date.parse(snapshot.val()[room].members[member].date);

        if (new Date() - date > timeout) {
          remove(ref(db, `rooms/${room}/members/${member}`));

          // 現在日の文字列を作成する
          const dateString = getDateString(new Date());

          document.getElementById('chat_panel').innerHTML +=
            `<div class="talk">${snapshot.val()[room].name} の ${member} を削除しました。 <span class="date">(${dateString})</span></div>`;
        }
      });
    });
  });
}