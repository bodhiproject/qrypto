import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography, TextField, Button, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import AppStore from '../../../stores/AppStore';
import { MESSAGE_TYPE } from '../../../constants';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

interface IState {
  importStore: any;
  walletStore: any;
}

@inject('store')
@observer
class ImportMnemonic extends Component<WithStyles & IProps, IState> {
  public componentWillUnmount() {
    this.props.store.importStore.reset();
  }

  public render() {
    const { classes, store: { importStore } }: any = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <Typography className={classes.headerText}>Import Wallet</Typography>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <TextField
                className={classes.mnemonicTextField}
                autoFocus
                required
                multiline
                rows={5}
                type="text"
                placeholder="Enter your seed phrase here to import your wallet."
                onChange={(e) => importStore.mnemonic = e.target.value}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <BorderTextField
                placeholder="Wallet name"
                error={!!importStore.walletNameError}
                errorText={importStore.walletNameError}
                onChange={(e: any) => importStore.accountName = e.target.value}
                onEnterPress={this.importMnemonic}
              />
            </div>
          </div>
          <div>
            <Button
              className={classes.importButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.importMnemonic}
              disabled={importStore.error}
            >
              Import
            </Button>
            <Button
              className={classes.cancelButton}
              fullWidth
              color="primary"
              onClick={importStore.cancelImport}
            >
              Cancel
            </Button>
          </div>
        </div>
        <ErrorDialog {...this.props} />
      </div>
    );
  }

  private importMnemonic = () => {
    const { history, store: { importStore } }: any = this.props;
    if (!importStore.error) {
      history.push('/loading');
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_MNEMONIC,
        accountName: importStore.accountName,
        mnemonic: importStore.mnemonic,
      });
    }
  }
}

const ErrorDialog: React.SFC<any> = observer(({ store: { importStore }}: any) => (
  <Dialog
    disableBackdropClick
    open={!!importStore.invalidMnemonic}
    onClose={() => importStore.invalidMnemonic = false}
  >
    <DialogTitle>Invalid Seed Phrase</DialogTitle>
    <DialogContent>
      <DialogContentText>This seed phrase has been used already.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => importStore.invalidMnemonic = false} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
));

export default withRouter<any>(withStyles(styles)(ImportMnemonic));
