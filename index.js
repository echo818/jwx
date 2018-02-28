const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const compiler = require('vue-template-compiler')
const compose = require('koa-compose')
const less = require('less')

const {
  resolvePath,
  getFilename,
  mkdir,
  formatpath
} = require('./utils')

const config = require('./vue.config')

chokidar.watch(resolvePath(config.src), {}).on('all', (event, filePath) => {
  if (event === 'change') {
    const destPath = resolvePath(mkdir(filePath, config.src, config.dist))
    const filename = getFilename(filePath)

    const content = fs.readFileSync(resolvePath(filePath), 'utf-8')
    const output = compiler.parseComponent(content, { pad: 'line' })
    
    if (output.template) {
      const templatePath = formatpath(destPath, filename, '.wxml')
      fs.writeFileSync(templatePath, output.template.content.replace(/^[\r\n]+/, ''))
    }
    if (output.script) {
      const scriptPath = formatpath(destPath, filename, '.js')
      fs.writeFileSync(scriptPath, output.script.content.replace(/^[\r\n|\/\/]+/, ''))
    }
    if (output.styles.length) {
      const styles = output.styles[0]
      const stylesPath = formatpath(destPath, filename, '.wxss')
      let stylesContent = styles.content.replace(/^[\r\n]+/, '')
      // if (styles.lang === 'less') {
      //   less.render(stylesContent).then(res => {
      //     fs.writeFileSync(stylesPath, res.css)
      //   })
      // } else {
      //   fs.writeFileSync(stylesPath, stylesContent)
      // }
      if (config.vue && config.vue.style) {
        const middleware = []
        config.vue.style.forEach(item => {
          middleware.push(require(item))
        })
        const fnMiddleware = compose(middleware)
        fnMiddleware(stylesContent).then(res => fs.writeFileSync(stylesPath, res))
      } else {
        fs.writeFileSync(stylesPath, stylesContent)
      }
    }
    if (output.customBlocks.length) {
      const configPath = formatpath(destPath, filename, '.json')
      fs.writeFileSync(configPath, output.customBlocks[0].content.replace(/^[\r\n]+/, ''))
    }
  }
})
