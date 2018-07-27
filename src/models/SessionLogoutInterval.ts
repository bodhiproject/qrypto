import { INTERVAL_NAMES } from '../constants';

export class SessionLogoutInterval {
  public interval: number;
  public name: string;

  constructor(interval: number, name: string) {
    this.interval = interval;
    this.name = name;
  }
}

export const sliArray = [
  new SessionLogoutInterval(0, INTERVAL_NAMES.NONE),
  new SessionLogoutInterval(60000, INTERVAL_NAMES.ONE_MIN),
  new SessionLogoutInterval(1200000, INTERVAL_NAMES.TWENTY_MIN),
  new SessionLogoutInterval(7200000, INTERVAL_NAMES.TWO_HOUR),
  new SessionLogoutInterval(43200000, INTERVAL_NAMES.TWELVE_HOUR),
];
