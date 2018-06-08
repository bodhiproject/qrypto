// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
// require('dotenv').config()
chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.sync.set({color: '#3aa757'}, function() {
  //   console.log("The color is green.");
  // });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "sendTx" )
    {
        // var tabURL = "Not set yet";
        // chrome.tabs.query({active:true},function(tabs){
        //     if(tabs.length === 0) {
        //         sendResponse({});
        //         return;
        //     }
        //     tabURL = tabs[0].url;
        //     sendResponse( {navURL:tabURL} );
        // });   
        console.log("background, sendTx")
        let sentTx = sendQtum();
        sendResponse(sentTx);     
    }
});

async function sendQtum() {
  // Send - generate, sign, and send tx//////////////////////
  let amountToSend = 0.15 * 1e8
  console.log("!#############")
  const sentTx = await wallet.send("qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6", amountToSend, {
    feeRate: 4000 //this number must be high enough, otherwise you may run into rate limiting problems
    // a feeRate does need to get set, as the default feeRate when left empty is insufficient, and will generate the error "rate limited free transaction. Code:-26'" 
    //TODO - hard coding this number for now but should let the client user set the fee, and/or dynamically default to a more appropriate number (look into estimatesmartfee)
  })
  console.log("!!!!!!!!!!!!!")
  console.log("sentTx", sentTx);
  return sentTx;
}

const QWallet = require('qtumjs-wallet')
const abi = require('ethereumjs-abi')
let wallet = null;

function loadWallet(){
  const network = QWallet.networks.testnet
  //GET WALLET
  let privateKey = process.env.PRIVATE_KEY1
  privateKey = "cQ4ibgec2EJivsBNHGaAWinZEaStEDZPtL4SBmnm5T9EKHxKhTAc"
  //pubKey: qcdw8hSkYmxt7kmHFoZ6J5aYUdM3A29idz

  // let privateKey2 = process.env.PRIVATE_KEY2
  //pubKey2: qNe4ZZp4mp86DkgmofFNLBhnCnzjfKvuW6

  //privateKey environment var may not be set, so we check for null
  if(privateKey == null){
    throw new Error(`Missing ${privateKey} ENV var`)
  }
  wallet = network.fromWIF(privateKey)
  console.log(wallet)
}
loadWallet()

async function mainWallet() {
  
  
  
  const info = await wallet.getInfo()
  // console.log("wallet info:", info)

  //TODO - temporarily hard coding my regtest AddressManager contract
  const contractAddress = "2c070a47c61d5eb03248ec81a2d9b0a87249c933"

  // ContractCall //////////////////////
  //8db8203d: arbitrationLength(); encoding of the contract method being called
  // const contractCallEncodedData = "8db8203d"
  // const callResult = await wallet.contractCall(contractAddress, contractCallEncodedData)
  // console.log(callResult['executionResult']['output'])

  // ContractSend - generate, sign, and send contract tx//////////////////////
  // e893f01b: setArbitrationLength(uint256)
  let contractSendEncodedMethod = "e893f01b"

  // Manual Encoding of parameter
  // returns the encoded binary (as a Buffer) data to be sent
  let encodedParam = abi.rawEncode([ "uint256" ], [ 76408 ])
  let encodedParamUnbuffered = encodedParam.toString('hex')
  // console.log("encodedParamUnbuffered:", encodedParamUnbuffered)
  // encoded_unbuffered: 0000000000000000000000000000000000000000000000000000000000012a70

  //TODO - currently not working, possibly needs updated version of qtum walletjs
  // let contractSendEncodedData = contractSendEncodedMethod + encodedParamUnbuffered
  // console.log("contractSendEncodedData:", contractSendEncodedData)
  // let contractSentTx = await wallet.contractSend(contractAddress, contractSendEncodedData, {
  //   amount: 0, //defaults to 0
  //   gasLimit: 250000, //defaults to 250000 
  //   gasPrice: 40, // defaults to 40
  //   //senderAddress is provided by the wallet object
  // })
  // console.log(contractSentTx)
}

sendQtum();

mainWallet().catch((err) => console.log(err))