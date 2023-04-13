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

  handleAddExpenseButton = (e) => {
    e.preventDefault();
    console.log('clicou');
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
        <section className="input-section">
          <label className="description-label first-row">
            <span>Descrição da Despesa</span>
            <input
              type="text"
              data-testid="description-input"
              value={ descriptionInput }
              name="descriptionInput"
              onChange={ this.handleChange }
              className="input-element description-input"
            />
          </label>
          <label className="tag-label first-row">
            <span>Categoria da despesa</span>
            <select
              name="tagInput"
              data-testid="tag-input"
              value={ tagInput }
              onChange={ this.handleChange }
              className="input-element tag-input"
            >
              <option value="food">Alimentação</option>
              <option value="fun">Lazer</option>
              <option value="work">Trabalho</option>
              <option value="transportation">Transporte</option>
              <option value="health">Saúde</option>
            </select>
          </label>
          <label className="value-label">
            <span>Valor</span>
            <input
              type="text"
              data-testid="value-input"
              name="valueInput"
              value={ valueInput }
              onChange={ this.handleChange }
              className="input-element value-input"
            />
          </label>
          <label className="method-label">
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
          <label className="currency-label">
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
        <section className="add-expense-section">
          <button
            className="add-expense-button"
            onClick={ this.handleAddExpenseButton }
          >
            Adicionar despesa
          </button>
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
