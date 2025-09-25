// 初期起動時の呼び出し
function initNews() {
  const items = [
    {date: "2025年9月末", content: "ミルモでポン！ 100円ショップグッズ", link: ""},
    {date: "2025年9月26日", content: "ミルモでポン！ Sweetie Halloween", link: "https://marukuji.jp/detail/265"},
    {date: "2025年8月29日", content: "ミルモでポン！ ポムポムプリンちゃおヒロインズ×サンリオキャラクターズ", link: "https://colyinc.com/0716-3/"},
//    {date: "2025年5月第2週", content: "ミルモでポン！ クリアラバーコースター", link: "https://gashapon.jp/products/detail.php?jan_code=4582769837043000"},
//    {date: "2025年4月下旬", content: "ミルモでポン！ ましゅもっちシリーズ", link: "https://www.fancy-fukuya.co.jp/topics/202504mirumodepon/"},
//    {date: "2025年4月12日", content: "ミルモでポン！ アベイルとのコラボ商品発売", link: "https://x.com/gravail/status/1906292868911911399"},
//    {date: "2025年3月第4週", content: "ミルモでポン！もぐもぐパーティー発売", link: "https://gashapon.jp/products/detail.php?jan_code=4582769745140000"},
//    {date: "2025年1月第4週", content: "ジェムリーズ ミルモでポン！発売", link: "https://gashapon.jp/products/detail.php?jan_code=4582769720284000"},
  ];
  let insertText = '';

  insertText += '<div id="newsHeader"></div>';
  insertText += '<div id="newsBody">';
  if (items.length == 0) {
    insertText += "<p>新しい情報はありません。</p>";
  } else {
    items.map(item => {
      insertText += `<p>${item.date}<br>`;
      insertText += `<a href="${item.link}">${item.content}</a></p>`
    });
  }
  insertText += '</div>';
  insertText += '<div id="newsFooter"></div>';
  $('#news').html(insertText);
}
