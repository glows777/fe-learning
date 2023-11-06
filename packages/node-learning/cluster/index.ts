import cluster from 'cluster'
import http from 'http'
import process from 'process'

// 主进程部分
if (cluster.isPrimary) {
  console.log('master', process.pid, 'is running')

  // fork 一个 worker 进程
  cluster.fork()

  // 监听所有 worker 进程的 exit 事件
  cluster.on('exit', (worker, code, signal) => {
    // 拿到所有的 worker 进程
    const workers = Object.values(cluster.workers ?? {}).filter(Boolean)

    // 如果是 由于断开链接而关闭的，则会 fork 一个新的 worker 进程
    // 然后监听 他的 listening 事件，当这个 worker 进程成功监听到 端口号后，则尝试断开下一个 worker 进程的链接
    // 有点像 递归，一个接着一个
    if (worker.exitedAfterDisconnect) {
      console.log(
        `worker ${worker.process.pid} disconnected, try restarting...`
      )
      cluster.fork().on('listening', () => {
        if (workers.length) {
          workers.shift()?.disconnect()
        }
      })
    } else {
      // 非 SIGHUP 信号，则直接重启一个新的 worker 进程
      console.log('killed by others', 'with signal', signal, 'and code', code)
      cluster.fork()
    }
  })

  process.on('SIGHUP', () => {
    const workers = Object.values(cluster.workers ?? {}).filter(Boolean)
    console.log('received SIGHUP signal. restarting workers...')
    // 收到重启信号，断开第一个 worker 进程
    workers.shift()?.disconnect()
  })
} else {
  // worker 进程部分
  // 启动一个 http 服务器
  const server = http.createServer((req, res) => {
    res.end('hello world')
  })
  server.listen(8080, () => {
    console.log('worker started', process.pid)
    console.log('server listening on port: 8080', 'http://localhost:8080')
  })
}
