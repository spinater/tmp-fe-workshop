const fs = require('fs')
const postcss = require('postcss')
const tailwind = require('tailwindcss')

async function run() {
  const inputPath = 'src/index.css'
  if (!fs.existsSync(inputPath)) {
    console.error('src/index.css not found')
    process.exit(2)
  }
  const input = fs.readFileSync(inputPath, 'utf8')
  try {
    const result = await postcss([tailwind('./tailwind.config.cjs')]).process(input, { from: undefined })
    const css = result.css
    const checks = ['.text-4xl', '.min-h-screen', '.bg-gray-50', '.dark\\:bg-gray-900']
    const found = checks.some(s => css.includes(s))
    if (found) {
      console.log('OK: compiled Tailwind utilities found')
      process.exit(0)
    } else {
      console.error('FAIL: compiled Tailwind utilities not found')
      // write compiled CSS for debugging
      fs.writeFileSync('tmp/compiled-tailwind.css', css)
      process.exit(1)
    }
  } catch (err) {
    console.error('ERROR during PostCSS processing:')
    console.error(err)
    process.exit(3)
  }
}

run()
