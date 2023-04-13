import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addExpense,
  disableEditor,
  editExpenseFormRenders,
  fetchCurrencies,
  fetchCurrenciesToExpense,
  refreshExpenses,
  refreshTotalExpense,
} from '../redux/actions';
import '../assets/styles/WalletForm.css';
import { INITIAL_WALLET_FORM_STATE } from '../constants';

class WalletForm extends Component {
  state = {
    descriptionInput: '',
    tagInput: 'Alimentação',
    valueInput: '',
    paymentMethodInput: 'Dinheiro',
    currencyInput: 'USD',
    isLoading: false,
    enableEdit: true,
    btnName: 'Adicionar despesa',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
  }

  async shouldComponentUpdate() {
    const { dispatch } = this.props;
    await dispatch(editExpenseFormRenders());
    const { editor } = this.props;
    const { enableEdit } = this.state;
    if (editor && enableEdit) {
      this.editExpense();
      return true;
    }
    return false;
  }

  editExpense = () => {
    const { expenseToEdit } = this.props;
    const { currency, description, method, tag, value } = expenseToEdit;
    this.setState({
      descriptionInput: description,
      tagInput: tag,
      valueInput: value,
      paymentMethodInput: method,
      currencyInput: currency,
      enableEdit: false,
      btnName: 'Disabled',
    });
  };

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

  handleEditSaveButton = async (e) => {
    e.preventDefault();
    const { dispatch, expenses, idToEdit } = this.props;
    const {
      valueInput,
      descriptionInput,
      currencyInput,
      paymentMethodInput,
      tagInput,
    } = this.state;
    const expense = {
      id: idToEdit,
      value: valueInput,
      description: descriptionInput,
      currency: currencyInput,
      method: paymentMethodInput,
      tag: tagInput,
      exchangeRates: expenses[idToEdit].exchangeRates,
    };
    const newExpenses = expenses.map((exp) => {
      if (exp.id === idToEdit) return expense;
      return exp;
    });
    await dispatch(refreshExpenses(newExpenses));
    dispatch(disableEditor());
    this.refreshTotal();
    this.setState(INITIAL_WALLET_FORM_STATE);
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
        this.setState(INITIAL_WALLET_FORM_STATE);
      });
    });
  };

  render() {
    const { currencies, editor } = this.props;
    const {
      descriptionInput,
      tagInput,
      valueInput,
      paymentMethodInput,
      currencyInput,
      isLoading,
      btnName,
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
            className="exp-btn"
            onClick={ this.handleAddExpenseButton }
            disabled={ editor }
          >
            {btnName}
          </button>
          { isLoading && (<p>Carregando...</p>) }
          <button
            className="exp-btn"
            onClick={ this.handleEditSaveButton }
            disabled={ !editor }
          >
            Editar despesa
          </button>
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
      exchangeRates: PropTypes.arrayOf().isRequired,
    }),
  ).isRequired,
  currenciesToExpense: PropTypes.shape(
    PropTypes.shape({
      code: PropTypes.string,
    }),
  ).isRequired,
  editor: PropTypes.bool.isRequired,
  idToEdit: PropTypes.number.isRequired,
  expenseToEdit: PropTypes.shape({
    currency: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    tag: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  currenciesToExpense: state.wallet.currenciesToExpense,
  editor: state.wallet.editor,
  idToEdit: state.wallet.idToEdit,
  expenseToEdit: state.wallet.expenseToEdit,
});

export default connect(mapStateToProps)(WalletForm);
