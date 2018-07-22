import { MESSAGE_TYPE } from '../constants';
import { handleLogin } from './login';

const onMessage = (request: any, sender: chrome.runtime.MessageSender) => {
  console.log('request', request);
  console.log('sender', sender);

  switch (request.type) {
    case MESSAGE_TYPE.LOGIN:
      handleLogin(request);
      break;

    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
