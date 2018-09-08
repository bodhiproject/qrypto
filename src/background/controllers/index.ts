import { every } from 'lodash';

import CryptoController from './cryptoController';
import TokenController from './tokenController';
import AccountController from './accountController';
import NetworkController from './networkController';
import ExternalController from './externalController';
import RPCController from './rpcController';
import InpageAccountController from './inpageAccountController';
import TransactionController from './transactionController';
import SessionController from './sessionController';
import { MESSAGE_TYPE } from '../../constants';

export default class QryptoController {
  public crypto: CryptoController;
  public token: TokenController;
  public account: AccountController;
  public network: NetworkController;
  public external: ExternalController;
  public rpc: RPCController;
  public inpageAccount: InpageAccountController;
  public transaction: TransactionController;
  public session: SessionController;

  private initialized: object = {};

  constructor() {
    this.crypto = new CryptoController(this);
    this.token = new TokenController(this);
    this.account = new AccountController(this);
    this.network = new NetworkController(this);
    this.external = new ExternalController(this);
    this.rpc = new RPCController(this);
    this.inpageAccount = new InpageAccountController(this);
    this.transaction = new TransactionController(this);
    this.session = new SessionController(this);
  }

  /*
  * Registers a controller.
  * @param name The name of the controller to be registered.
  */
  public registerController = (name: string) => {
    this.initialized[name] = false;
  }

  /*
  * Routes to the login page after all controllers are initialized.
  * @param name The name of the controller that was initialized.
  */
  public controllerInitialized = (name: string) => {
    this.initialized[name] = true;

    if (every(this.initialized)) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ROUTE_LOGIN });
    }
  }
}
