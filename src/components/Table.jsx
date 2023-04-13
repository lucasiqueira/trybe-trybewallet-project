import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  editExpenseBegins,
  editExpenseCapture,
  refreshTotalExpense,
  removeExpense,
} from '../redux/actions';
import { DELETE_BTN_TEXT_POSITION, EDIT_BTN_TEXT_POSITON } from '../constants';
import '../assets/styles/Table.css';
import delIcon from '../assets/svg/trash-can-icon.svg';
import editIcon from '../assets/svg/edit-icon.svg';

class Table extends Component {
  refreshTotal = () => {
    const { expenses, dispatch } = this.props;
    const totalExpense = expenses.reduce((acc, curr) => {
      acc += Number(curr.exchangeRates[curr.currency].ask * curr.value);
      return acc;
    }, 0);
    dispatch(refreshTotalExpense(totalExpense.toFixed(2)));
  };

  onEditButtonClick = ({ target }) => {
    const id = Number(target.name.slice(EDIT_BTN_TEXT_POSITON));
    const { dispatch } = this.props;
    dispatch(editExpenseBegins(id));
    dispatch(editExpenseCapture(id));
  };

  onDeleteButtonClick = async ({ target }) => {
    const id = Number(target.name.slice(DELETE_BTN_TEXT_POSITION));
    const { dispatch } = this.props;
    await dispatch(removeExpense(id));
    this.refreshTotal();
  };

  render() {
    const { expenses } = this.props;
    return (
      <section className="table-section">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {
              expenses.map((exp) => {
                const {
                  id,
                  tag,
                  currency,
                  description,
                  exchangeRates,
                  method,
                  value,
                } = exp;
                return (
                  <tr key={ id }>
                    <td>{description}</td>
                    <td>{tag}</td>
                    <td>{method}</td>
                    <td>{Number(value).toFixed(2)}</td>
                    <td>{exchangeRates[currency].name}</td>
                    <td>{Number(exchangeRates[currency].ask).toFixed(2)}</td>
                    <td>{(exchangeRates[currency].ask * value).toFixed(2)}</td>
                    <td>Real</td>
                    <td>
                      <button
                        data-testid="edit-btn"
                        name={ `edit-btn-${id}` }
                        onClick={ this.onEditButtonClick }
                        className="table-button"
                      >
                        <span className="no-show-label">Editar</span>
                        <img src={ editIcon } alt="Editar" />
                      </button>
                      <button
                        data-testid="delete-btn"
                        onClick={ this.onDeleteButtonClick }
                        className="table-button"
                      >
                        <span className="no-show-label">Excluir</span>
                        <img src={ delIcon } name={ `delete-btn-${id}` } alt="Excluir" />
                      </button>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    tag: PropTypes.string,
    currency: PropTypes.string,
    description: PropTypes.string,
    exchangeRates: PropTypes.shape(
      PropTypes.shape({
        ask: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
    method: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(Table);
