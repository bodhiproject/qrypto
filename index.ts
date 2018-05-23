import { networks, generateMnemonic } from "qtumjs-wallet"
require('dotenv').config()

async function mainWallet() {
  const network = networks.testnet
  
  //GET WALLET
  let privateKey = process.env.PRIVATE_KEY1
  //pubKey: qcdw8hSkYmxt7kmHFoZ6J5aYUdM3A29idz

  let privateKey2 = process.env.PRIVATE_KEY2
  //pubKey2: qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6

  //privateKey environment var may not be set
  if(privateKey == null){
    throw new Error(`Missing ${privateKey} ENV var`)
  }
  const wallet = network.fromWIF(privateKey)
  const info = await wallet.getInfo()
  console.log("wallet info:", info)

  //TODO - currently some rate limiting problems with insight api when sending transactions to the node at https://testnet.qtum.org/insight-api , will be setting it up to point to a local testnet node that is not rate limited
  //Generate, sign, and send the transaction
  // const sentTx = await wallet.send("qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6", 0.15 * 1e8, {
  //   feeRate: 400
  // })
}

mainWallet().catch((err) => console.log(err))
