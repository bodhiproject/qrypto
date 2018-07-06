import Permission from './Permission';

export default class SubAccount {
  private _name: string;
  private _permissions: Permission[] = [];

  constructor(name: string, permissions: Permission[]) {
    this._name = name;
    this._permissions = permissions;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }

  set permissions(permissions: Permission[]) {
    this._permissions = permissions;
  }
}
