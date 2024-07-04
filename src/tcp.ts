import Net, { Socket } from 'net'

const port = Number(process.env.TCP_PORT)
const host = process.env.TCP_HOST

const sockets: any[] = []

const server = Net.createServer()
server.listen(port, host, () => {
  console.log(`TCP server on port ${port}`)
})

server.on('connection', (sock: Socket) => {
  console.log(`CONNECTED: ${sock.remoteAddress}:${sock.remotePort}`)
  sockets.push(sock)

  sock.on('data', (data: any) => {
    console.log(`DATA ${sock.remoteAddress} : ${data}`)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sockets.forEach((sock: any, index: number, array: any[]) => {
      sock.write(data)
    })
  })

  sock.on('close', () => {
    const index = sockets.findIndex((o: any) => {
      return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort
    })
    if (index !== -1) sockets.splice(index, 1)
    sock.end()
    console.log(`CLOSED:  ${sock.remoteAddress}:${sock.remotePort}`)
  })

  sock.on('error', () => {
    console.log('Error socket client')
  })
})
