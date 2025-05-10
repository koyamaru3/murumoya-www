export function digestMessage(message) {
  return new Promise(function(resolve){
  var msgUint8 = new TextEncoder("utf-8").encode(message);
  crypto.subtle.digest('SHA-256', msgUint8).then(
      function(hashBuffer){
          var hashArray = Array.from(new Uint8Array(hashBuffer));
          var hashHex = hashArray.map(function(b){return b.toString(16).padStart(2, '0')}).join('');
          return resolve(hashHex);
      });
  })
}

// Date型時刻のフォーマット変換（チャットメッセージ用）
export function getDateStringForChat(d) {
  return `${(d.getMonth()+1).toString()}/
${d.getDate().toString()}
(${[ "日", "月", "火", "水", "木", "金", "土" ][d.getDay()]}) 
${d.getHours().toString()}:
${d.getMinutes().toString().padStart(2, '0')}
`.replace(/\n|\r/g, '');
}

// Date型時刻のフォーマット変換
export function getDateString(d) {
  return `${(d.getFullYear().toString())}/
${(d.getMonth()+1).toString().padStart(2, '0')}/
${d.getDate().toString().padStart(2, '0')} 
${d.getHours().toString().padStart(2, '0')}:
${d.getMinutes().toString().padStart(2, '0')}:
${d.getSeconds().toString().padStart(2, '0')}
`.replace(/\n|\r/g, '');
}

// サニタイズ処理
export function sanitize(str) {
  return String(str).replace(/&/g,"&amp;")
    .replace(/"/g,"&quot;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
}