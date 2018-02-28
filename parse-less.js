const less = require('less')

module.exports = async (content) => {
  return await less.render(content).then(res => {
    return res.css
  })
}
