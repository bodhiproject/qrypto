import { observable } from 'mobx';

class ImportMnemonicStore {
  @observable public password: string = '';
  @observable public confirmPassword: string = '';
}

export default new ImportMnemonicStore();
