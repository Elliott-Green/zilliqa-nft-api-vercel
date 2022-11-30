const express = require('express')
const nftMetadataController = require('../controllers/nft-metadata-controller')
const router = express.Router()

// Returns contract specific metadata for the whole contract
router.get('/metadata*', nftMetadataController.getContractMetadata)

// Returns metadata for a specific token_id
router.get('/:token_id', nftMetadataController.getTokenID)

module.exports = router
