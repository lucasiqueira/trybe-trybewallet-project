import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { refreshTotalExpense, removeExpense } from '../redux/actions';
import { DELETE_BTN_TEXT_POSITION } from '../constants';

class Table extends Component {
  refreshTotal = () => {
    const { expenses, dispatch } = this.props;
    const totalExpense = expenses.reduce((acc, curr) => {
      acc += Number(curr.exchangeRates[curr.currency].ask * curr.value);
      return acc;
    }, 0);
    dispatch(refreshTotalExpense(totalExpense.toFixed(2)));
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
      <table>
        <thead>
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
        <tbody>
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
                      data-testid="delete-btn"
                      onClick={ this.onDeleteButtonClick }
                      name={ `delete-btn-${id}` }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
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
