const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

/**
 * 解析文件路径
 * @param {String} filePath 文件路径
 */
exports.resolvePath = (filePath) => {
  return path.resolve(cwd, filePath)
}

/**
 * 获取文件扩展名
 * @param {String} filePath 文件路径
 */
exports.extname = (filePath) => {
  return path.extname(filePath)
}

/**
 * 获取文件名
 * @param {String} filePath 文件路径
 */
exports.getFilename = (filePath) => {
  return path.parse(filePath).name
}

/**
 * 新建文件目录
 * @param {String} filePath 文件路径
 * @param {String} srcPath 源目录
 * @param {String} destPath 目标目录
 */
exports.mkdir = (filePath, srcPath, destPath) => {
  const dirname = path.dirname(path.resolve(filePath))
  const dirPath = dirname.slice(path.resolve(srcPath).length)
  
  return dirPath.split(path.sep).reduce((itemPath, item) => {
    itemPath = path.join(itemPath, item)
    try {
      fs.accessSync(path.resolve(itemPath))
    } catch (error) {
      fs.mkdirSync(path.resolve(itemPath))
    }
    return itemPath
  }, destPath)
}

/**
 * 设置文件路径
 * @param {String} destPath 目标目录
 * @param {String} filename 文件名
 * @param {String} extname 文件扩展名
 */
exports.formatpath = (destPath, filename, extname) => {
  return path.format({
    dir: destPath,
    name: filename,
    ext: extname
  })
}
