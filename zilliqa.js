const configVars = require('./config')
const cache = require('./cache/cache')

const { Zilliqa, toBech32Address, fromBech32Address, validation } = require('@zilliqa-js/zilliqa')

const nft_contract_address = configVars.nft_contract_address.toLowerCase()

const zilliqa_network = configVars.zilliqa_network.toLowerCase()
let zilliqa_network_string = GetNetworkString(zilliqa_network.toLowerCase())
const zilliqa = new Zilliqa(zilliqa_network_string)

module.exports = {
  // Gets the latest token_id from the chain for the contract configured in `config.js`
  getLatestTokenID: async function () {
    const cacheResult = cache.GetKey(`getLatestTokenID`)
    if (cacheResult === false) {
      const current_token_id = await zilliqa.blockchain.getSmartContractSubState(nft_contract_address, 'token_id_count')
      console.log(JSON.stringify(current_token_id))

      cache.SetKey(`getLatestTokenID`, current_token_id.result.token_id_count, 10)
      console.log(`getLatestTokenID: ${current_token_id.result.token_id_count}`)
      return current_token_id.result.token_id_count
    } else {
      return cacheResult
    }
  }
}

function GetNetworkString(network) {
  if (network == 'mainnet') return 'https://api.zilliqa.com'
  if (network == 'testnet') return 'https://dev-api.zilliqa.com'
  else console.log(`couldn't parse network string, returning mainnet`)
  return 'https://api.zilliqa.com'
}
