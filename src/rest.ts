import { getHostname } from './utils.js'
import { createHmac } from 'node:crypto'
import { URL, URLSearchParams } from 'node:url'
import { fetch } from 'undici'

interface RequestOptions {
  method: string
  path: string
  data?: Record<string, string>
  requireAuth?: boolean
}

interface RestOptions {
  key?: string
  secret?: string
  passphrase?: string
  network?: 'mainnet' | 'testnet'
  headers?: Record<string, any>
}

class HttpError extends Error {
  status: number
  statusText: string

  constructor(status: number, statusText: string, message: string) {
    super(message)

    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
  }
}

export const createRestClient = (options: RestOptions = {}) => {
  const {
    key = process.env.LNM_API_KEY,
    secret = process.env.LNM_API_SECRET,
    network = process.env.LNM_API_NETWORK ?? 'mainnet',
    passphrase = process.env.LNM_API_PASSPHRASE,
    headers = {},
  } = options

  const hostname = process.env.LNM_API_HOSTNAME ?? getHostname(network)

  const request = async (options: RequestOptions) => {
    const { method, path, data, requireAuth } = options

    if (requireAuth) {
      if (!key) {
        throw new Error('You need an API key to use an authenticated route')
      } else if (!secret) {
        throw new Error('You need an API secret to use an authenticated route')
      } else if (!passphrase) {
        throw new Error(
          'You need an API passphrase to use an authenticated route'
        )
      }

      const timestamp = Date.now()

      const payload = /^(GET|DELETE)$/.test(method)
        ? new URLSearchParams(data).toString()
        : JSON.stringify(data)

      const signature = createHmac('sha256', secret)
        .update(`${timestamp}${method}/v2${path}${payload}`)
        .digest('base64')

      Object.assign(headers, {
        'LNM-ACCESS-KEY': key,
        'LNM-ACCESS-PASSPHRASE': passphrase,
        'LNM-ACCESS-TIMESTAMP': timestamp,
        'LNM-ACCESS-SIGNATURE': signature,
      })
    }

    const url = new URL(`https://${hostname}/v2${path}`)

    if (data && /^(GET|DELETE)$/.test(method)) {
      for (const [key, value] of Object.entries(data)) {
        url.searchParams.append(key, value.toString())
      }
    }

    const body = /^(POST|PUT)$/.test(method) ? JSON.stringify(data) : undefined

    Object.assign(headers, {
      'Content-Type': 'application/json',
    })

    const response = await fetch(url, { method, body, mode: 'cors', headers })

    if (response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        return response.json()
      }

      return response.text()
    }

    const text = await response.text()

    throw new HttpError(response.status, response.statusText, text)
  }

  const futuresGetTicker = () => {
    return request({ method: 'GET', path: '/futures/ticker' })
  }

  const futuresNewTrade = (data: any) => {
    return request({
      method: 'POST',
      path: '/futures',
      requireAuth: true,
      data,
    })
  }

  const futuresUpdateTrade = (data: any) => {
    return request({
      method: 'PUT',
      path: '/futures',
      requireAuth: true,
      data,
    })
  }

  const futuresCloseTrade = (id: string) => {
    return request({
      method: 'DELETE',
      path: '/futures',
      data: { id },
      requireAuth: true,
    })
  }

  const futuresCloseAllTrades = () => {
    return request({
      method: 'DELETE',
      path: '/futures/all/close',
      requireAuth: true,
    })
  }

  const futuresCancelTrade = (id: string) => {
    return request({
      method: 'POST',
      path: '/futures/cancel',
      data: { id },
      requireAuth: true,
    })
  }

  const futuresCancelAllTrades = () => {
    return request({
      method: 'DELETE',
      path: '/futures/all/cancel',
      requireAuth: true,
    })
  }

  const futuresCashinTrade = (data: any) => {
    return request({
      method: 'POST',
      path: '/futures/cash-in',
      requireAuth: true,
      data,
    })
  }

  const futuresAddMarginTrade = (data: any) => {
    return request({
      method: 'POST',
      path: '/futures/add-margin',
      requireAuth: true,
      data,
    })
  }

  const futuresGetTrades = (data: any) => {
    return request({
      method: 'GET',
      path: '/futures',
      requireAuth: true,
      data,
    })
  }

  const futuresPriceHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/futures/history/price',
      data,
    })
  }

  const futuresIndexHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/futures/history/index',
      data,
    })
  }

  const futuresFixingHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/futures/history/fixing',
      data,
    })
  }

  const futuresCarryFeesHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/futures/carry-fees',
      data,
    })
  }

  const userGet = () => {
    return request({ method: 'GET', path: '/user', requireAuth: true })
  }

  const userUpdate = (data: any) => {
    return request({ method: 'PUT', path: '/user', requireAuth: true, data })
  }

  const userDeposit = (data: any) => {
    return request({
      method: 'POST',
      path: '/user/deposit',
      requireAuth: true,
      data,
    })
  }

  const userDepositHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/user/deposit',
      requireAuth: true,
      data,
    })
  }

  const userWithdraw = (data: any) => {
    return request({
      method: 'POST',
      path: '/user/withdraw',
      requireAuth: true,
      data,
    })
  }

  const userWithdrawUsd = (data: any) => {
    return request({
      method: 'POST',
      path: '/user/withdraw/usd',
      requireAuth: true,
      data,
    })
  }

  const userWithdrawHistory = (data: any) => {
    return request({
      method: 'GET',
      path: '/user/withdraw',
      requireAuth: true,
      data,
    })
  }

  const optionsInstruments = () => {
    return request({ method: 'GET', path: '/options/instruments' })
  }

  const optionsInstrument = (data: any) => {
    return request({ method: 'GET', path: '/options/instrument', data })
  }

  const optionsMarket = () => {
    return request({ method: 'GET', path: '/options/market' })
  }

  const optionsNewTrade = (data: any) => {
    return request({
      method: 'POST',
      path: '/options',
      requireAuth: true,
      data,
    })
  }

  const optionsGetTrades = (data: any) => {
    return request({
      method: 'GET',
      path: '/options',
      requireAuth: true,
      data,
    })
  }

  const optionsCloseTrade = (id: string) => {
    return request({
      method: 'DELETE',
      path: '/options',
      data: { id },
      requireAuth: true,
    })
  }

  const optionsCloseAllTrades = () => {
    return request({
      method: 'DELETE',
      path: '/options/all/close',
      requireAuth: true,
    })
  }

  const optionsUpdateSettlement = (data: any) => {
    return request({
      method: 'PUT',
      path: '/options',
      requireAuth: true,
      data,
    })
  }

  return {
    request,
    futuresGetTicker,
    futuresNewTrade,
    futuresUpdateTrade,
    futuresCloseTrade,
    futuresCloseAllTrades,
    futuresCancelTrade,
    futuresCancelAllTrades,
    futuresCashinTrade,
    futuresAddMarginTrade,
    futuresGetTrades,
    futuresPriceHistory,
    futuresIndexHistory,
    futuresFixingHistory,
    futuresCarryFeesHistory,
    userGet,
    userUpdate,
    userDeposit,
    userDepositHistory,
    userWithdraw,
    userWithdrawUsd,
    userWithdrawHistory,
    optionsInstrument,
    optionsInstruments,
    optionsMarket,
    optionsNewTrade,
    optionsGetTrades,
    optionsCloseTrade,
    optionsCloseAllTrades,
    optionsUpdateSettlement,
  }
}
