// 初期起動時の呼び出し
function initNews() {
  const items = [
    {date: "2027年1月", content: "ミルモでポン！フィンガーパペット", link: "https://tokyo-yumeya.co.jp/goods/mirumodeponyubiningyou/"},
    {date: "2026年12月", content: "ミルモでポン！ぬいぐるみスマホチャーム", link: "https://tokyo-yumeya.co.jp/goods/mirumodeponsmahocharm/"},
    {date: "2026年11月", content: "ミルモでポン！ぬいぐるみボールチェーン", link: "https://tokyo-yumeya.co.jp/goods/mirumodeponnuiballchain/"},
    {date: "2026年10月31日", content: "ミルモでポン！ぺたもりしーるリフィル", link: "https://www.bandai.co.jp/catalog/item.php?jan_cd=4582770083330000"},
    {date: "2026年10月", content: "ミルモでポン！ぬいぐるみポーチ", link: "https://tokyo-yumeya.co.jp/goods/mirumodeponnuipouch/"},
    {date: "2026年10月26日", content: "ミルモでポン！愛蔵版3巻", link: ""},
    {date: "2026年10月26日", content: "ミルモでポン！愛蔵版2巻", link: ""},
    {date: "2026年10月17日", content: "ミルモでポン！しまむらとのコラボアイテム", link: "https://x.com/shimamura_gr/status/2110974023597195280"},
//    {date: "2026年9月25日", content: "書店限定グッズ　ミルモで本！屋さん シリーズ", link: "https://marimocraft.co.jp/event/mdp0925/"},
//    {date: "2026年9月25日", content: "ミルモでポン！愛蔵版1巻", link: "https://www.shogakukan.co.jp/books/09873610"},
//    {date: "2026年9月25日", content: "ミルモでポン！にゅ〜 コミックス１巻", link: "https://www.shogakukan.co.jp/books/09873611"},
//    {date: "2026年9月中旬", content: "サンキューマート ミルモでポン！コラボ雑貨", link: "https://thankyoumart.jp/blogs/news/mirumo_de_pon?srsltid=AfmBOoopl__4qKpakCPTvAVf8K_m-ZzrYLhH2PcUUp98H69iJM5iVVnQ"},
//    {date: "2026年7月15日", content: "CanCamナイトプール×『ミルモでポン！』", link: "https://cancam.jp/archives/1749597"},
//    {date: "2026年7月中旬", content: "ミルモでポン！ サガラ刺繍シール", link: "https://x.com/friendcharacter/status/2074055754139541652"},
//    {date: "2026年6月26日", content: "ミルモでポン！ キラキラシールブック", link: "https://www.shogakukan.co.jp/books/09735631"},
//    {date: "2026年5月29日", content: "まるくじ『ミルモでポン！』【おやすみたいむ】", link: "https://marukuji.jp/detail/333"},
//    {date: "2026年5月1日", content: "ミルモでポン！ 阪神タイガースのコラボグッズ", link: "https://natalie.mu/comic/news/668840"},
//    {date: "2026年2月13日", content: "ミルモでポン！ SPINNS限定コラボアイテム", link: "https://www.spinns.jp/c/collabo/mirumodepon"},
//    {date: "2026年1月30日", content: "ミルモでポン！×WEGOコラボアイテム", link: "https://wego.jp/blogs/news/chao-collabo?utm_source=X_press&utm_medium=post"},
//    {date: "2025年12月中旬", content: "ミルモでポン！ ぬいぐるみがま口ポーチ", link: "https://www.fancy-fukuya.co.jp/topics/202512mirumodepon02/"},
//    {date: "2025年12月中旬", content: "ミルモでポン！ ミニボストンバッグ", link: "https://www.fancy-fukuya.co.jp/topics/202512mirumodepon/"},
//    {date: "2025年12月19日", content: "『コロちゃお』ミルモコラボデザインのたまごっち", link: "https://www.corocoro.jp/special/13"},
//    {date: "2025年11月第４週", content: "ミルモでポン！ つまんでつなげてますこっと", link: "https://gashapon.jp/products/detail.php?jan_code=4582769892172000"},
//    {date: "2025年11月中旬", content: "ミルモでポン！ マスコットぬいぐるみ～聖歌隊～", link: "https://www.fancy-fukuya.co.jp/topics/202511mirumodepon/"},
//    {date: "2025年10月31日", content: "ちゃお12月号 ふろくにミルモのシール", link: "https://ciao.shogakukan.co.jp/topics/194308/"},
//    {date: "2025年9月末", content: "ミルモでポン！ 100円ショップグッズ", link: ""},
//    {date: "2025年9月26日", content: "ミルモでポン！ Sweetie Halloween", link: "https://marukuji.jp/detail/265"},
//    {date: "2025年8月29日", content: "ミルモでポン！ ポムポムプリンちゃおヒロインズ×サンリオキャラクターズ", link: "https://colyinc.com/0716-3/"},
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
