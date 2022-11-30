const nftMetadataModel = require('../models/nft-metadata-model.js')

module.exports = {
  getTokenID: async function (req, res) {
    console.log(`GetTokenID: ${req.params.token_id}`)
    const token_id = req.params.token_id
    const response = await nftMetadataModel.getNFTFileIfMinted(res, token_id)
    console.log(response)
    if (!response?.error) return res.send(response)
    else return res.status(response.status).json(response.error)
  },
  getContractMetadata: async function (req, res) {
    console.log(`GetContractMetadata`)
    const response = await nftMetadataModel.getContractMetadata(res)
    console.log(response)
    if (!response?.error) return res.send(response)
    else return res.status(response.status).json(response.error)
  }
}
