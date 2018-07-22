import { store } from '../stores/AppStore';

export const handleLogin = async ({ password }: any) => {
  store.walletStore.login(password);
};
