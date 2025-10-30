module.exports = {
  files: [
    'FE/src',
    'BE/src',
    'src'
  ],
  formatter: {
    indentStyle: 'space',
    indentSize: 2
  },
  linter: {
    exclude: ['**/node_modules/**', 'FE/dist/**']
  }
}
