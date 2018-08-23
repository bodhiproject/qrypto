import { networks } from 'qtumjs-wallet';

onmessage = (e) => {
  try {
    
    // const network = e.data.network
    const mnemonic = e.data.mnemonic
    const wallet = networks.testnet.fromMnemonic(mnemonic);
    console.log("walletww - worker@", wallet)
    // var stW = JSON.stringify(wallet)
    console.log("stw", stW)
    // var pstW = JSON.parse(stW);
    console.log("pstW", pstW)
    // parent.postMessage(obj, 'wallet');
    //TODO - there seems to be some problems with posting the wallet obj, seems like you cant post objects that have functions attached to them. I tried stringifying it to see if I could pass it that way, but that did not work either. 
    postMessage({ wallet });
    
  } catch (err) {
    postMessage({ err });
  }
}
