import { observable, action } from 'mobx';

const INIT_VALUES = {
  seedPhrase: '',
};

export default class SaveSeedStore {
  @observable public seedPhrase: string = INIT_VALUES.seedPhrase;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
