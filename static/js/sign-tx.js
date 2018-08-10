let fromAddress;
let request;

const updateFields = () => {
  const { args } = request;
  const to = args[0];
  const amount = args[2] || 0;
  const gasLimit = args[3] || 200000;
  const gasPrice = args[4] ? args[4] / 10e8 : 0.0000004;
  const maxTxFee = Math.round(gasLimit * gasPrice * 1000) / 1000;

  document.getElementById('from-field').innerText = fromAddress;
  document.getElementById('to-field').innerText = to;
  document.getElementById('amount-field').innerText = amount;
  document.getElementById('gas-limit-field').innerText = gasLimit;
  document.getElementById('gas-price-field').innerText = gasPrice.toFixed(8);
  document.getElementById('max-tx-fee-field').innerText = maxTxFee;
  document.getElementById('raw-tx-field').innerText = JSON.stringify(request);
};

const extractReqParams = () => {
  const urlParams = window.location.search.substr(1).split('&');
  urlParams.forEach((param) => {
    const keyValue = param.split('=');
    if (keyValue.length !== 2) {
      return;
    }

    const key = keyValue[0];
    if (key === 'req') {
      request = JSON.parse(decodeURIComponent(keyValue[1]));
      delete request.account; // Remove the account obj from the raw request
    } else if (key === 'from') {
      fromAddress = keyValue[1];
    }
  });

  updateFields();
};

const confirmTransaction = () => {
  const { id, args } = request;
  chrome.runtime.sendMessage({
    type: 27, // MESSAGE_TYPE.EXTERNAL_SEND_TO_CONTRACT
    id,
    args,
  });

  window.close();
};

const cancelTransaction = () => {
  window.close();
};

window.onload = () => {
  extractReqParams();
  document.getElementById('button-confirm').addEventListener('click', confirmTransaction);
  document.getElementById('button-cancel').addEventListener('click', cancelTransaction);
}
