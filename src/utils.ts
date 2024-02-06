export const getHostname = (network: string) => {
  if (network === 'testnet') {
    return 'api.testnet.lnmarkets.com'
  }

  return 'api.lnmarkets.com'
}
