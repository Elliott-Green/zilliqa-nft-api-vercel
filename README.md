# Zilliqa NFT API

The ZRC-6 NFT Contract provides a way for users to provide a `base_uri` at deploy time to provide a mutable way to provide metadata, rather than using `token_uri`.

When minting a token two parameters are required to complete the call. `to` and `token_uri`. When a user provides a `token_uri`, then the metadata is always ready from `token_uri`, even if `base_uri` is set.

The correct way to deal with mutable metadata is to senpcct `token_uri` to be an empty string which indicates to ecosystem providers that the metadata can be found by combining `base_uri` with the `token_id` being minted.

If `base_uri` is set to a URI like `www.example.com/api/`, then the metadata can be found at `www.example.com/api/{token_id}` replacing `{token_id}` with the token being queried.

There are different advantages and disadvantages for using `base_uri` over `token_uri`. some of the key points to consider are covered below

## Comparing base_uri with token_uri

### Advantages

- Metadata is mutable and can be changed.
  Everybody makes mistakes. Once a `token_uri` has been set, there's no changing it. Using `base_uri` lets you change and update metadata as time goes on.

- New collections
  If you're releasing a new collection, then `base_uri` is well suited to be used - since you can hide and reveal metadata as you please (since it's mutable)

- Guards
  Not an advantage, but using the blockchain state, the API can determine how many NFT's are minted, and only expose metadata up to and including that token. This means you cannot forward scan the API for metadata on tokens that haven't been minted.

- Migration at the end of minting
  Since one of the disadvantages is hosting. Once your collection has finish minted and the metadata won't change any futher. You can potentially create a HTTP/IPFS/AR folder to host all of the metadata static JSON files so they can still be accessed by `base_uri + /{token_id}`. You can then update your `base_uri` to point at your static file server (S3, IPFS folder, AR folder) and then depreciate the API and any DNS.

- Docker
  For advanced users, you can easily add this API to your existing orchestration system of choice.

- External Minting
  Letting your API decide what metadata to serve allows for other contracts to easily interact with your contracts Mint/BatchMint calls. An Sales Proxy could be used to take funds and distribute NFT's. Other marketplaces could also interact with your sales proxy to a larger audience. Whereas if you used `token_uri`, vendors would need to know what `token_uri` you were going to mint, so they could make the call with the right parameters, which they wouldn't know because the `token_uri` would have been prior uploaded and centralised.

### Disadvantages

- Hosting
  Since the API is code running on a server, rather than just static files. There's an upkeep on a server to run this and a domain name to host from. Best case, you already have a server which you can run this API on and an existing domain name to create potentially some subdomains on. Worse case, you'd need to purchase both of these and upkeep them until the minting has finished.

## Usage

Thanks to [Akhilome](https://github.com/akhilome/express-vercel) for creating this express+vercel template as a stub.

Making use of this template is pretty straightforward. The best way is to generate a new project on Github using this as a template. This lets Vercel take care of the deployment and hosting and gets you setup in seconds.

Alternatively if you already have an existing server, you can clone this and then have something like PM2 keep the process alive.

## Bundled Endpoints

After cloning/forking this template, the following endpoints can be immediately accessed:

- `GET /{x}` || `GET /{x}.json`
  Where `{x}` is a valid int (token_id).
  Returns the JSON in `/nfts/{x}.json` for that token_id.
  Used for examining a particular tokens metadata/image.
  Returns 200 on success.
  Returns 400 on invalid routes.
  Returns 500 when cannot read a JSON metadata file.

- `GET /metadata` || `GET /metadata.json`
  Where the string `/metadata` is found.
  Returns the JSON in `/nfts/metadata.json`.
  Used for examining the metadata for the whole contract.

- `GET /`
  Returns 404 `Cannot GET / `
  Signals that this is an API.

## Configuration

### 1. Contracts + config.js

You should deploy an NFT contract to a Zilliqa network (mainnet/testnet) and that will let you configure the `config.js` file accordingly.

```js
  api_timeout_seconds: 15,
  port: 3001,
  cache_enabled: true,
  cache_timer_seconds: 3,
  nft_contract_address: 'zil132e27rxvaecetf7pvqc0hh77v5qajxgrdl8rav',
  zilliqa_network: 'mainnet' // mainnet or testnet
```

Set `nft_contract_address` and `zilliqa_network` accordingly.

If using Vercel, you can set `cache_enabled` to `false` and ignore everything else. Serverless functions make any state like caches redundant, setting this to `true` will actually not have any caching effect.

If you have existing VMs/Infrastructure to host this API on, then you can play about with enabling the cache.

### 2. Import metadata

ZRC-7 standard metadata should be placed in the `/nfts/` folder.

Token 1's metadata should be found at `/nfts/1.json`, token 2's at `/nfts/2.json` and so on. These should be commited for the API to pick up the latest changes. There's an example file called `/nfts/1.json` which can be removed / overwritten.

A stub file for the whole contract's metadata has been created at `/nfts/metadata.json` and should be filled out.

### 3. Deploy + base_uri

Commit these changes and Vercel will deploy them.

The API shields against looking at future tokens which haven't been minted yet. So by test minting some tokens on your contract, you should be able to navigate to your copy of the API `https://zilliqa-nft-api-vercel-GUID-your-name.vercel.app` with the routes `/1.json` and `/metadata.json` which will return your static files.

Finally, we can call `SetBaseURI` on our NFT contract which sets our new mutable metadata path, which then tells indexers to refresh the metadata for this collection, any changes will be fetched for all the tokens, and now ecosystem partners get the latest copy of an NFT's metadata.

### package.json commands

`npm run local` - Starts the API with Node, sometimes this gives a better error message than using `vercel start`.
`npm run start` - Starts the API with Vercels CLI. If it errors here, it will error on Vercel if you deploy what you have.
`npm run check` - Fetches files which require linting.
`npm run lint` - Lints and formats all files.
