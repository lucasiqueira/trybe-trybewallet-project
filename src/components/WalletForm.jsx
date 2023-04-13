import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addExpense,
  fetchCurrencies,
  fetchCurrenciesToExpense,
  refreshTotalExpense,
} from '../redux/actions';
import '../assets/styles/WalletForm.css';

class WalletForm extends Component {
  state = {
    descriptionInput: '',
    tagInput: 'Alimentação',
    valueInput: '',
    paymentMethodInput: 'Dinheiro',
    currencyInput: 'USD',
    isLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  refreshTotal = () => {
    const { expenses, dispatch } = this.props;
    const totalExpense = expenses.reduce((acc, curr) => {
      acc += Number(curr.exchangeRates[curr.currency].ask * curr.value);
      return acc;
    }, 0);
    dispatch(refreshTotalExpense(totalExpense.toFixed(2)));
  };

  handleAddExpenseButton = (e) => {
    e.preventDefault();
    const { dispatch, expenses } = this.props;
    this.setState({ isLoading: true }, async () => {
      await dispatch(fetchCurrenciesToExpense());
      this.setState({ isLoading: false }, async () => {
        const { currenciesToExpense } = this.props;
        const {
          valueInput,
          descriptionInput,
          currencyInput,
          paymentMethodInput,
          tagInput,
        } = this.state;
        const expense = {
          id: expenses.length,
          value: valueInput,
          description: descriptionInput,
          currency: currencyInput,
          method: paymentMethodInput,
          tag: tagInput,
          exchangeRates: currenciesToExpense,
        };
        await dispatch(addExpense(expense));
        this.refreshTotal();
        this.setState({
          descriptionInput: '',
          tagInput: 'Alimentação',
          valueInput: '',
          paymentMethodInput: 'Dinheiro',
          currencyInput: 'USD',
        });
      });
    });
  };

  render() {
    const { currencies } = this.props;
    const {
      descriptionInput,
      tagInput,
      valueInput,
      paymentMethodInput,
      currencyInput,
      isLoading,
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
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
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
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
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
          {
            isLoading && (
              <p>Carregando...</p>
            )
          }
        </section>
      </form>
    );
  }
}

WalletForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  currenciesToExpense: PropTypes.shape(
    PropTypes.shape({
      code: PropTypes.string,
    }),
  ).isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  currenciesToExpense: state.wallet.currenciesToExpense,
});

export default connect(mapStateToProps)(WalletForm);
