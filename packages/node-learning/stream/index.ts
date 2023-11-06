import fs from 'fs'
import { Transform } from 'stream'

const base64Transformer = new Transform({
  transform(chunk: Buffer, encoding, callback) {
    const input = chunk.toString()
    this.push(Buffer.from(input.endsWith('\n') ? input.slice(0, -1) : input).toString('base64'))
    callback()
  },
})

process.stdin.pipe(base64Transformer).pipe(process.stdout)

