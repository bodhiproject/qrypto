import { observable } from 'mobx';

class LoginStore {
  @observable public password: string = '';
  @observable public confirmPassword: string = '';
}

export default new LoginStore();
