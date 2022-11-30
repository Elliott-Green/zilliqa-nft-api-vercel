const cache = require('../cache/cache')
const zilliqaCalls = require('../zilliqa')
const fs = require('fs')

module.exports = {
  // Returns the data in `nfts/${token_id}.json`
  getNFTFileIfMinted: async function (res, token_id) {
    if (Number.isInteger(Number.parseInt(token_id))) {
      const cacheResult = cache.GetKey(`NFT-${token_id}`)
      if (cacheResult === false) {
        if (token_id > (await zilliqaCalls.getLatestTokenID())) {
          return { error: `NFT not minted ${token_id}`, status: 403 }
        } else {
          try {
            var data = fs.readFileSync(`./nfts/${token_id}.json`, 'utf8')
            cache.SetKey(`NFT-${token_id}`, data)
            return JSON.parse(data)
          } catch (e) {
            return { error: `Could not read JSON file for NFT ${token_id}s metadata`, status: 500 }
          }
        }
      } else {
        return JSON.parse(cacheResult)
      }
    } else {
      return { error: `${token_id} is not a valid integer`, status: 400 }
    }
  },
  // Returns the data in `nfts/metadata.json`
  getContractMetadata: async function (res) {
    const cacheResult = cache.GetKey(`ContractMetadata`)
    if (cacheResult === false) {
      try {
        var data = fs.readFileSync(`./nfts/metadata.json`, 'utf8')
        console.log(data)
        cache.SetKey(`ContractMetadata`, data)
        return JSON.parse(data)
      } catch (e) {
        return { error: `Could not read data for contract metadata` }
      }
    } else {
      return JSON.parse(cacheResult)
    }
  }
}
