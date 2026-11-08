Grammar Mission — 更新・文法項目追加ガイド
=====================================

【今回の更新】
既存の GitHub リポジトリへ、このZIPにある index.html、app.js、style.css、data/grammar.js を同じ場所にアップロードして上書きしてください。
assets/ フォルダはZIPに含めていません。GitHub上の既存の画像は消さずに残してください。

【既存の文法項目】
Infinitives: assets/infinitives/set01_studentA.png、set01_studentB.png ... set06_studentB.png
Participle (Ving/Vpp): assets/participles/set01_a.png、set01_b.png ... set05_b.png

空港の分詞画像は、assets/participles/set05_a.png と set05_b.png に置いてください。

【今後の追加方法】
1. assets/ 配下に新しいフォルダを作成する（例：assets/relative-clauses/）。
2. A/Bの2枚をセットごとに追加（例：set01_a.png、set01_b.png）。
3. data/grammar.js の window.GRAMMAR_CATALOG 配列に、新しい文法項目のオブジェクトを1つ追加。

追記例（配列の既存項目との間にカンマが必要です）：
{
  id: "relative-clauses",
  title: "Relative Clauses",
  folder: "assets/relative-clauses",
  imagePattern: "set{id}_{role}.png",
  roleCase: "lower",
  sets: [
    { id: "01", title: "At the Museum", level: "Easy" },
    { id: "02", title: "On the Street", level: "Middle" }
  ]
}

追加セットだけなら、該当する文法項目の sets に1行を追加し、A/B画像を置くだけです。

【画像名の柔軟な設定】
原則: imagePattern: "set{id}_{role}.png", roleCase: "lower"
  -> set01_a.png, set01_b.png
従来の不定詞: imagePattern: "set{id}_student{role}.png", roleCase: "upper"
  -> set01_studentA.png, set01_studentB.png
例外的なファイル名なら、セットに images を追記できます：
  { id: "03", title: "City", level: "Hard", images: { A: "special_A.png", B: "special_B.png" } }

【違いの個数について】
個数の設定・表示・チェック欄はなくしました。生徒には正解数が表示されません。

【その他】
2分タイマー、A/B選択、フルスクリーン、日英翻訳機能は従来どおりです。
日英翻訳のオンライン代替サービスを使う際は、入力した文章が外部サービスに送信されます。
画像表示が更新されないときはブラウザを強制再読み込みしてください。
