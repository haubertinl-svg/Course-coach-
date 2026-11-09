// Génère les icônes PNG (192, 512, maskable, apple-touch) depuis public/icons/icon.svg
// Usage : npm run icons   (nécessite `sharp`, installé avec les devDependencies)
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const svg = readFileSync('public/icons/icon.svg')
const out = 'public/icons'

await sharp(svg).resize(192, 192).png().toFile(`${out}/icon-192.png`)
await sharp(svg).resize(512, 512).png().toFile(`${out}/icon-512.png`)
await sharp(svg).resize(180, 180).png().toFile(`${out}/apple-touch-icon.png`)

// Maskable : icône réduite à 80 % centrée sur fond uni pour respecter la zone de sécurité
const inner = await sharp(svg).resize(410, 410).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#05070a' } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(`${out}/icon-maskable-512.png`)

console.log('Icônes générées dans', out)
