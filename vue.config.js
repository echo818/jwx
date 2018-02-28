module.exports = {
  entry: 'app.vue',
  src: 'src',
  dist: 'dist',
  vue: {
    style: [
      './parse-less',
      './parse-css'
    ]
  }
}