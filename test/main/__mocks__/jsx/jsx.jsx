// 1:1 copied from https://github.com/mozilla/payments-ui. Removed the todos, though
import React, { Component, PropTypes } from 'react';

import PayMethodChoice from 'components/pay-method-choice';
import ProductDetail from 'components/product-detail';

import * as products from 'products';
import { gettext } from 'utils';
import tracking from 'tracking';


export default class ProductPayChooser extends Component {

  static propTypes = {
    payMethods: PropTypes.array.isRequired,
    payWithNewCard: PropTypes.func.isRequired,
    processPayment: PropTypes.func.isRequired,
    productId: PropTypes.string.isRequired,
    userDefinedAmount: PropTypes.string,
  }

  componentDidMount() {
    tracking.setPage('/product-pay-chooser');
  }

  handleSubmit = (payMethodUri, processingId) => {
    this.props.processPayment({productId: this.props.productId,
                               userDefinedAmount: this.props.userDefinedAmount,
                               payMethodUri: payMethodUri,
                               processingId: processingId});
  }

  render() {
    var product = products.get(this.props.productId);
    var submitPrompt;
    if (product.seller.kind === 'donations') {
      submitPrompt = gettext('Donate now');
    } else {
      // also handle non-recurring, non-donations here.
      submitPrompt = gettext('Subscribe');
    }

    return (
      <div>
        <ProductDetail
          productId={this.props.productId}
          userDefinedAmount={this.props.userDefinedAmount}
        />
        <PayMethodChoice
          payMethods={this.props.payMethods}
          productId={this.props.productId}
          submitButtonText={submitPrompt}
          submitHandler={this.handleSubmit}
          useDropDown
        />
        <a className="add-card" href="#"
          onClick={this.props.payWithNewCard}>
          {gettext('Add new credit card')}
        </a>
      </div>
    );
  }
}
