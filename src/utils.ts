export const getHostname = (network: string) => {
  if (network === 'mainnet') {
    return 'api.lnmarkets.com'
  } else if (network === 'testnet') {
    return 'api.testnet.lnmarkets.com'
  }

  return 'api.lnmarkets.com'
}
