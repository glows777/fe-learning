import cluster from 'cluster'
import http from 'http'
import process from 'process'

if (cluster.isPrimary) {
  console.log('master', process.pid, 'is running')
  cluster.fork()
  const workers = Object.values(cluster.workers ?? {}).filter(Boolean)
  cluster.on('exit', (worker, code, signal) => {
    if (worker.exitedAfterDisconnect) {
      console.log(`worker ${worker.process.pid} disconnected, try restarting...`)
      cluster.fork().on('listening', () => {
        if (workers.length) {
          workers.shift()?.disconnect()
        }
      })
    } else {
      console.log('killed by others', 'with signal', signal, 'and code', code)
      cluster.fork()
    }
  })

  process.on('SIGHUP', () => {
    console.log('received SIGHUP signal. restarting workers...')
    workers.shift()?.disconnect()
  })
} else {
  const server = http.createServer((req, res) => {
    res.end('hello world')
  })
  server.listen(8080, () => {
    console.log('worker started', process.pid)
    console.log('server listening on port: 8080', 'http://localhost:8080')
  })
}
