require('dotenv').config()
const QWallet = require('qtumjs-wallet')

async function mainWallet() {
  const network = QWallet.networks.testnet
  
  //GET WALLET
  let privateKey = process.env.PRIVATE_KEY1
  //pubKey: qcdw8hSkYmxt7kmHFoZ6J5aYUdM3A29idz

  let privateKey2 = process.env.PRIVATE_KEY2
  //pubKey2: qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6

  //privateKey environment var may not be set, so we check for null
  if(privateKey == null){
    throw new Error(`Missing ${privateKey} ENV var`)
  }
  const wallet = network.fromWIF(privateKey)
  const info = await wallet.getInfo()
  console.log("wallet info:", info)

  //Generate, sign, and send the transaction
  const sentTx = await wallet.send("qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6", 0.15 * 1e8, {
    feeRate: 4000 //this number must be high enough, otherwise you may run into rate limiting problems
    // a feeRate does need to get set, as the default feeRate when left empty is insufficient, and will generate the error "rate limited free transaction. Code:-26'" 
    //TODO: hard coding this number for now but should let the client user set the fee, and/or dynamically default to a more appropriate number (look into estimatesmartfee)
  })
  console.log(sentTx);
}

mainWallet().catch((err) => console.log(err))
