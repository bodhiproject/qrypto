function showWindow(width: number, height: number, url: string = '', name: string = 'qrypto-window'): Window {
  const top = (screen.availHeight / 2) - (height / 2);
  const left = (screen.availWidth / 2) - (width / 2);
  const options = `
    height=${height},
    width=${width},
    screenX=${left},
    screenY=${top},
    toolbar=no,
    menubar=no,
    scrollbars=no,
    resizable=no,
    location=no,
    status=no
  `;
  return window.open(url, name, options)!;
}

export function showSignTxWindow(url: string) {
  if (!url) {
    throw Error('Cannot resolve Sign Transaction Dialog URL.');
  }
  showWindow(350, 550, url, 'Confirm Transaction');
}
