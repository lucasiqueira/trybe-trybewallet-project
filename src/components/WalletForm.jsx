import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCurrencies } from '../redux/actions';
import '../assets/styles/WalletForm.css';

class WalletForm extends Component {
  state = {
    descriptionInput: '',
    tagInput: 'food',
    valueInput: '',
    paymentMethodInput: 'cash',
    currencyInput: 'USD',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  render() {
    const { currencies } = this.props;
    const {
      descriptionInput,
      tagInput,
      valueInput,
      paymentMethodInput,
      currencyInput,
    } = this.state;
    return (
      <form className="form-section">
        <section className="form-line">
          <label>
            <span>Descrição da Despesa</span>
            <input
              type="text"
              data-testid="description-input"
              value={ descriptionInput }
              name="descriptionInput"
              onChange={ this.handleChange }
              className="input-element"
            />
          </label>
          <label>
            <span>Categoria da despesa</span>
            <select
              name="tagInput"
              data-testid="tag-input"
              value={ tagInput }
              onChange={ this.handleChange }
              className="input-element"
            >
              <option value="food">Alimentação</option>
              <option value="fun">Lazer</option>
              <option value="work">Trabalho</option>
              <option value="transportation">Transporte</option>
              <option value="health">Saúde</option>
            </select>
          </label>
        </section>
        <section className="form-line">
          <label>
            <span>Valor</span>
            <input
              type="text"
              data-testid="value-input"
              name="valueInput"
              value={ valueInput }
              onChange={ this.handleChange }
              className="input-element"
            />
          </label>
          <label>
            <span>Método de Pagamento</span>
            <select
              name="paymentMethodInput"
              data-testid="method-input"
              value={ paymentMethodInput }
              onChange={ this.handleChange }
              className="input-element"
            >
              <option value="cash">Dinheiro</option>
              <option value="credit-card">Cartão de crédito</option>
              <option value="debit-card">Cartão de débito</option>
            </select>
          </label>
          <label>
            <span>Moeda</span>
            <select
              name="currencyInput"
              data-testid="currency-input"
              value={ currencyInput }
              onChange={ this.handleChange }
              className="input-element"
            >
              {
                currencies.map((cur) => <option value={ cur } key={ cur }>{cur}</option>)
              }
            </select>
          </label>
        </section>
      </form>
    );
  }
}

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
});

export default connect(mapStateToProps)(WalletForm);
