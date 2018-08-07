import React, { Component } from 'react';
import { Typography, TextField, Button, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import AppStore from '../../stores/AppStore';

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
class ImportPrivateKey extends Component<WithStyles & IProps, IState> {
  public componentWillUnmount() {
    this.props.store.importStore.reset();
  }

  public render() {
    const { classes, store: { importStore } }: any = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <Typography className={classes.headerText}>Import Private Key</Typography>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <TextField
                className={classes.privateKeyTextField}
                autoFocus
                required
                multiline
                rows={2}
                type="text"
                placeholder="Enter your private key here to import your wallet."
                onChange={(e) => importStore.privateKey = e.target.value}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.privateKeyFieldInput },
                }}
              />
              <BorderTextField
                placeholder="Wallet name"
                error={importStore.walletNameTaken}
                errorText={importStore.walletNameError}
                onChange={(e: any) => importStore.accountName = e.target.value}
                onEnterPress={importStore.importPrivateKey}
              />
            </div>
          </div>
          <div>
            <Button
              className={classes.importButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={importStore.importPrivateKey}
              disabled={importStore.privateKeyPageError}
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
         {/* <ErrorDialog {...this.props} /> */}
      </div>
    );
  }
}

// TODO1 - validation on private key length
// TODO2
// const ErrorDialog: React.SFC<any> = observer(({ store: { importStore }}: any) => (
//   <Dialog
//     disableBackdropClick
//     open={!!importStore.invalidMnemonic}
//     onClose={() => importStore.invalidMnemonic = false}
//   >
//     <DialogTitle>Invalid Seed Phrase</DialogTitle>
//     <DialogContent>
//       <DialogContentText>This seed phrase has been used already.</DialogContentText>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={() => importStore.invalidMnemonic = false} color="primary">Close</Button>
//     </DialogActions>
//   </Dialog>
// ));

export default withStyles(styles)(ImportPrivateKey);
