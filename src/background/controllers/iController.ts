import QryptoController from '.';

export default abstract class IController {
  protected main: QryptoController;
  private name: string;

  constructor(name: string, main: QryptoController) {
    this.name = name;
    this.main = main;
    this.registerController();
  }

  public initFinished = () => {
    this.main.controllerInitialized(this.name);
  }

  private registerController = () => {
    this.main.registerController(this.name);
  }
}
