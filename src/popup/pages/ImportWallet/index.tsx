import React, { Component } from 'react';
import { Typography, TextField, Button, withStyles, WithStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import AppStore from '../../stores/AppStore';
import { IMPORT_TYPE } from '../../../constants';

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
class ImportWallet extends Component<WithStyles & IProps, IState> {
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
              <TypeField {...this.props} />
              <TextField
                className={classes.mnemonicPrKeyTextField}
                autoFocus
                required
                multiline
                rows={5}
                type="text"
                placeholder={`Enter your ${importStore.importType} here to import your wallet.`}
                onChange={(e) => importStore.mnemonicPrivateKey = e.target.value}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicPrKeyFieldInput },
                }}
              />
              {!!importStore.mnemonicPrivateKey && importStore.privateKeyError && (
                <Typography className={classes.errorText}>{importStore.privateKeyError}</Typography>
              )}
                <BorderTextField
                  classNames={classes.borderTextFieldContainer}
                  placeholder="Wallet name"
                  error={importStore.walletNameTaken}
                  errorText={importStore.walletNameError}
                  onChange={(e: any) => importStore.accountName = e.target.value}
                  onEnterPress={importStore.importMnemonicOrPrKey}
                />
            </div>
          </div>
          <div>
            <Button
              className={classes.importButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={importStore.importMnemonicOrPrKey}
              disabled={importStore.mnemonicPrKeyPageError}
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
}

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }: any) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

const TypeField = observer(({ classes, store: { importStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Select Type" />
    <div className={classes.fieldContentContainer}>
      <Select
        className={classes.typeSelect}
        disableUnderline
        value={importStore.importType}
        onChange={(event) => importStore.changeImportType(event.target.value)}
      >
        <MenuItem value={IMPORT_TYPE.MNEMONIC}>
          <Typography className={classes.menuItemTypography}>Seed Phrase</Typography>
        </MenuItem>
        <MenuItem value={IMPORT_TYPE.PRIVATE_KEY}>
          <Typography className={classes.menuItemTypography}>Private Key</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
));

const ErrorDialog: React.SFC<any> = observer(({ store: { importStore }}: any) => (
  <Dialog
    disableBackdropClick
    open={importStore.importMnemonicPrKeyFailed}
    onClose={() => importStore.importMnemonicPrKeyFailed = false}
  >
    <DialogTitle>{`Invalid ${importStore.importType}`}</DialogTitle>
    <DialogContent>
      <DialogContentText>This wallet has already been imported.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => importStore.importMnemonicPrKeyFailed = false} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
));

export default withStyles(styles)(ImportWallet);
