import QryptoController from './controllers';

// Add instance to window for debugging
const controller = new QryptoController();
Object.assign(window, { controller });
