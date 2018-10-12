import { action, observable } from 'mobx';
const extension = require('extensionizer');

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../../constants';

export default class MainContainerStore {
  @observable public unexpectedError?: string = undefined;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public init = () => {
    extension.runtime.onMessage.addListener(this.handleMessage);
  }

  @action
  private handleMessage = (request: any) => {
    const { loginStore, importStore, routerStore }: any = this.app;
    switch (request.type) {
      case MESSAGE_TYPE.ROUTE_LOGIN:
        routerStore.push('/login');
        break;

      case MESSAGE_TYPE.ACCOUNT_LOGIN_SUCCESS:
        routerStore.push('/home');
        break;

      case MESSAGE_TYPE.LOGIN_FAILURE:
        loginStore.invalidPassword = true;
        routerStore.push('/login');
        break;

      case MESSAGE_TYPE.LOGIN_SUCCESS_WITH_ACCOUNTS:
        routerStore.push('/account-login');
        break;

      case MESSAGE_TYPE.LOGIN_SUCCESS_NO_ACCOUNTS:
        routerStore.push('/create-wallet');
        break;

      case MESSAGE_TYPE.IMPORT_MNEMONIC_PRKEY_FAILURE:
        importStore.importMnemonicPrKeyFailed = true;
        routerStore.goBack();
        break;

      case MESSAGE_TYPE.UNEXPECTED_ERROR:
        if (routerStore.location.pathname === '/loading') {
          routerStore.goBack();
        }
        this.unexpectedError = request.error;
        break;

      default:
        break;
    }
  }
}
