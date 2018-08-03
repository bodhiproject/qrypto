import React, { Component } from 'react';
import { Typography, TextField, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

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
    const { classes, store: { addTokenStore } } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Add Token" />
        <div className={classes.contentContainer}>
          <div className={classes.fieldsContainer}>
            <ContractAddressField onEnterPress={this.onEnterPress} {...this.props} />
            {addTokenStore.name &&
            (<div>
              <DetailField fieldName={'Token Name'} value={addTokenStore.name || ''} classes={classes} />
              <DetailField fieldName={'Token Symbol'} value={addTokenStore.symbol || ''} {...this.props} />
              <DetailField fieldName={'Decimals'} value={addTokenStore.decimals || ''} {...this.props} />
            </div>)
            }
          </div>
          {!!addTokenStore.tokenAlreadyInListError && (
            <Typography className={classes.errorText}>{addTokenStore.tokenAlreadyInListError}</Typography>
          )}
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

const DetailField = ({ classes, fieldName, value }: any) => (
  <div className={cx(classes.detailContainer)}>
    <div className={classes.labelContainer}>
      <Typography className={cx(classes.detailLabel)}>{fieldName}</Typography>
    </div>
    <div className={classes.valueContainer}>
      <Typography className={classes.detailValue}>{value}</Typography>
    </div>
  </div>
);

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
