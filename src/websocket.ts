import Websocket from 'ws'
import { randomBytes } from 'node:crypto'
import { getHostname } from './utils.js'

interface WebsocketClientOptions {
  network?: string
  version?: string
  heartbeat?: boolean
}

interface WebsocketResponse {
  jsonrpc: string
  id: string
  method: string
  result?: any
  error?: any
  params?: Record<string, any>
}

export const createWebsocketClient = async (
  options: WebsocketClientOptions = {}
) => {
  const {
    network = process.env.LNM_API_NETWORK || 'mainnet',
    version = process.env.LNM_API_VERSION || 'v1',
    heartbeat = true,
  } = options

  const ws = await new Promise<Websocket>((resolve, reject) => {
    const hostname = process.env.LNM_API_HOSTNAME || getHostname(network)
    const url = `wss://${hostname}`

    const ws = new Websocket(url)
    ws.once('error', reject)
    ws.once('open', () => resolve(ws))
  })

  if (heartbeat) {
    ws.ping()

    ws.on('pong', () => {
      setTimeout(() => {
        ws.ping()
      }, 5000)
    })
  }

  ws.on('message', (data: any) => {
    try {
      const response = JSON.parse(data) as WebsocketResponse

      if (response) {
        const { id, method, result, error, params } = response
        ws.emit('response', response)

        if (method === 'subscription' && params) {
          const { channel, data } = params
          ws.emit(channel, data)
        } else if (id) {
          ws.emit(id, result, error)
        }
      }
    } catch (error) {
      ws.emit('error', data)
    }
  })

  const disconnect = () => {
    ws.close()
  }

  const send = (
    method: string,
    params: Record<string, any> | string | number | undefined
  ) => {
    if (ws.readyState !== 1) {
      throw new Error('Websocket Client is not connected')
    }

    const payload = {
      jsonrpc: '2.0',
      id: randomBytes(16).toString('hex'),
      method,
      params,
    }

    return new Promise<unknown>((resolve, reject) => {
      ws.send(JSON.stringify(payload), (error) => {
        if (error) {
          reject(error)
        }

        const done = (result: any, error: any) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        }

        ws.once(payload.id, done)
      })
    })
  }

  const publicPing = () => {
    return send(`${version}/public/ping`, undefined) as Promise<string>
  }

  const publicChannels = () => {
    return send(`${version}/public/channels`, undefined) as Promise<string[]>
  }

  const publicSubscribe = (channels: string[]) => {
    return send(`${version}/public/subscribe`, channels) as Promise<string[]>
  }

  const publicUnsubscribe = (channels: string[]) => {
    return send(`${version}/public/unsubscribe`, channels) as Promise<string[]>
  }

  return {
    ws,
    disconnect,
    send,
    publicSubscribe,
    publicUnsubscribe,
    publicPing,
    publicChannels,
  }
}
