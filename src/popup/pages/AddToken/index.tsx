import React, { Component } from 'react';
import { Typography, TextField, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import { handleEnterPress } from '../../../utils';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class AddToken extends Component<WithStyles & IProps, {}> {
  public componentDidMount() {
    this.props.store.addTokenStore.init();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Add Token" />
        <div className={classes.contentContainer}>
          <div className={classes.fieldsContainer}>
            <ContractAddressField onEnterPress={this.onEnterPress} {...this.props} />
            <NameField {...this.props} />
            <SymbolField {...this.props} />
            <DecimalsField {...this.props} />
          </div>
          <AddButton {...this.props} />
        </div>
      </div>
    );
  }

  private onEnterPress = (event: any) => {
    handleEnterPress(event, () => {
      if (!this.props.store.addTokenStore.buttonDisabled) {
        this.props.store.addTokenStore.addToken();
      }
    });
  }
}

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }: any) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

const ContractAddressField = observer(({ classes, store: { addTokenStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Contract Address" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        value={addTokenStore.contractAddress || ''}
        InputProps={{ disableUnderline: true }}
        onChange={(event) => addTokenStore.contractAddress = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {!!addTokenStore.contractAddress && addTokenStore.contractAddressFieldError && (
      <Typography className={classes.errorText}>{addTokenStore.contractAddressFieldError}</Typography>
    )}
  </div>
));

const NameField = observer(({ classes, store: { addTokenStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Token Name" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        value={addTokenStore.name || ''}
        InputProps={{ disableUnderline: true }}
        disabled
      />
    </div>
  </div>
));

const SymbolField = observer(({ classes, store: { addTokenStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Token Symbol" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        value={addTokenStore.symbol || ''}
        InputProps={{ disableUnderline: true }}
        disabled
      />
    </div>
  </div>
));

const DecimalsField = observer(({ classes, store: { addTokenStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Decimals" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        value={addTokenStore.decimals || ''}
        InputProps={{ disableUnderline: true }}
        disabled
      />
    </div>
  </div>
));

const AddButton = observer(({ classes, store: { addTokenStore } }: any) => (
  <Button
    className={classes.addButton}
    fullWidth
    variant="contained"
    color="primary"
    disabled={addTokenStore.buttonDisabled}
    onClick={addTokenStore.addToken}
  >
    Add
  </Button>
));

export default withStyles(styles)(AddToken);
