import Net from 'net'

let client: Net.Socket

export const tcpConnection = (callback: (client: Net.Socket) => void) => {
  client = new Net.Socket()
  const host = process.env.TCP_HOST
  const port = Number(process.env.TCP_PORT)
  console.log(host, port)
  client.connect({ host, port }, () => {
    console.log(`TCP connection established with ${host}:${port}`)
    callback(client)
  })

  client.on('error', (err) => {
    console.log(err)
  })

  client.on('close', () => {
    console.log('TCP connection closed')
  })
}

export const getTcpClient = () => {
  return client
}
