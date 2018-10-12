import { observable } from 'mobx';
const extension = require('extensionizer');

import { INTERVAL_NAMES, MESSAGE_TYPE } from '../../constants';
import { SessionLogoutInterval } from '../../models/SessionLogoutInterval';

const INIT_VALUES = {
  sessionLogoutInterval: 0,
};

export default class SettingsStore {
  @observable public sessionLogoutInterval: number = INIT_VALUES.sessionLogoutInterval;

  public sliArray: SessionLogoutInterval[];

  constructor() {
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.GET_SESSION_LOGOUT_INTERVAL }, (response: any) => {
      this.sessionLogoutInterval = response;
    });

    this.sliArray = [
      new SessionLogoutInterval(0, INTERVAL_NAMES.NONE),
      new SessionLogoutInterval(60000, INTERVAL_NAMES.ONE_MIN),
      new SessionLogoutInterval(600000, INTERVAL_NAMES.TEN_MIN),
      new SessionLogoutInterval(1800000, INTERVAL_NAMES.THIRTY_MIN),
      new SessionLogoutInterval(7200000, INTERVAL_NAMES.TWO_HOUR),
      new SessionLogoutInterval(43200000, INTERVAL_NAMES.TWELVE_HOUR),
    ];
  }

  public changeSessionLogoutInterval = (sliInterval: number) => {
    this.sessionLogoutInterval = sliInterval;
    extension.runtime.sendMessage({
      type: MESSAGE_TYPE.SAVE_SESSION_LOGOUT_INTERVAL,
      value: this.sessionLogoutInterval,
    });
  }
}
