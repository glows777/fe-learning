const path = require('path')
const fs = require('fs')
const vm = require('vm')

function MyModule(id = '') {
  this.id = id
  this.filename = path.resolve(id)
  this.exports = {}
  this.filename = null
  this.loaded = false
}

// require 实际上是 调用 _load 方法
MyModule.require = function (id) {
  console.log('开始执行 require 模块', id)
  return MyModule._load(id)
}

// 存放缓存模块
MyModule._cache = Object.create(null)

// 加载 模块
// 返回 module.exports
MyModule._load = function (id) {
  console.log('开始执行 _load', id)
  // 根据 id 解析出 filename
  const filename = MyModule._resolvePath(id)

  // 根据 filename 判断是否有 缓存，有的话，直接返回 缓存的 exports 即可
  const cachedModule = MyModule._cache[filename]
  if (cachedModule !== undefined) {
    console.log('有缓存，直接取出缓存, id是: ', id)
    return cachedModule.exports
  }

  console.log('没有缓存，构造模块并加载, id是: ', id)
  // 没有缓存 则构造一个模块 并且调用 load 方法加载
  const module = new MyModule(filename)
  // load 之前就将这个模块缓存下来，这样如果有循环引用就会拿到这个缓存，但是这个缓存里面的 exports 可能还没有或者不完整
  MyModule._cache[filename] = module
  module.load(filename)

  return module.exports
}

// 这里就是 找寻模块路径
// 为了便于理解
// 这里只做 通过相对路径和绝对路径来查找文件，并支持自动添加 js 
MyModule._resolvePath = function (id) {
  console.log('解析 模块路径', id)
  const filename = path.resolve(id)
  const extname = path.extname(id)

  // 如果 没有后缀，则尝试找寻，添加后缀，找到则返回
  if (!extname) {
    const exts = Object.keys(MyModule._extensions)
    for (const ext of exts) {
      const curPath = `${filename}${ext}`
      if (fs.existsSync(curPath)) {
        return curPath
      }
    }
  }
  return filename
}

MyModule._extensions = {}

MyModule.prototype.load = function (filename) {
  console.log('开始加载，编译模块', filename)
  // 拿到 后缀，根据后缀，调用相应的 加载函数 来处理
  const extname = path.extname(filename)
  MyModule._extensions[extname](this, filename)
  this.loaded = true
}

// js 文件的 加载函数
MyModule._extensions['.js'] = function (module, filename) {
  console.log('为 js 类型文件，开始读取，编译', filename)
  // 思路很简单，读取文件内容，随后编译，执行该文件
  const content = fs.readFileSync(filename, 'utf-8')
  module._compile(content, filename)
}

// 编译 文件
// 首先，我们在执行 js 的时候，是可以拿到 一些全局变量，例如 require exports module __filename __dirname
// 所以，在执行前，我们要注入这些变量
// 实现也很简单，通过 IIFE 的形式注入即可
// 所以，这里我们需要将 js 代码包裹一层 IIFE，后续 执行的时候，可以注入这些变量
MyModule.prototype._compile = function (content, filename) {
  // 将 读取的代码 包裹起来
  const wrappedFn = MyModule._wrap(content)

  console.log('开始编译', filename)

  // vm 是 nodejs 的虚拟机沙盒模块，runInThisContext 方法可以接受一个字符串并将它转化为一个函数
  // 返回值就是转化后的函数，所以 compiledFn 是一个函数
  const compiledFn = vm.runInThisContext(wrappedFn, {
    filename,
    lineOffset: 0,
    displayErrors: true,
  })
  console.log('编译完成，开始执行模块，将导出的信息注入 module.exports')
  const dirname = path.resolve(filename)

  // 执行 这段代码，注入全局变量
  // 代码中 会有类似 module.exports.xxx = xxx，这就为 this.exports 挂载上了 导出的属性
  compiledFn.call(
    // call 的第一个参数就是 this，这里传入了 this.exports, 也就是 module.exports
    // 这也是为什么在 js 文件里面 this 是对 module.exports 的一个引用
    this.exports,
    this.exports,
    this.require,
    this, // module 就是 this，指向当前模块
    filename,
    dirname
  )
}

// 需要包裹的部分
// 注意拼接的开头和结尾多了一个()包裹，这样我们后面可以拿到这个匿名函数
// 拿到后，在后面再加一个 () 就可以传参数执行了。
MyModule.wrapper = [
  '(function(exports, require, module, __filename, __dirname){',
  '\n})',
]
// 包裹函数
// 将需要执行的 js 代码拼接到这个方法中间
MyModule._wrap = function (content) {
  console.log('将代码 包裹起来')
  return MyModule.wrapper[0] + content + MyModule.wrapper[1]
}

module.exports.MyModule = MyModule
