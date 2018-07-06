export default class Permission {
  private _name: string;
  private _allowed: boolean = false;

  constructor(name: string, allowed: boolean) {
    this._name = name;
    this.allowed = allowed;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get allowed(): boolean {
    return this._allowed;
  }

  set allowed(allowed: boolean) {
    this._allowed = allowed;
  }
}
