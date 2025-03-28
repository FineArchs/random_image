const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '../public/images')
const outputPath = path.join(__dirname, '../src/images.json')

// 画像ファイル一覧を取得
const imageFiles = fs.readdirSync(imagesDir).filter((file) => {
  return /\.(png|jpe?g|webp|gif)$/i.test(file)
})

// JSON に変換して出力
fs.writeFileSync(outputPath, JSON.stringify(imageFiles, null, 2))

console.log(`✅ ${imageFiles.length} images exported to src/images.json`)
