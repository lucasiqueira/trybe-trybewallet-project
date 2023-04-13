import {
  ADD_EXPENSE,
  DISABLE_EDITOR,
  EDIT_EXPENSE_BEGINS,
  EDIT_EXPENSE_CAPTURE,
  EDIT_EXPENSE_FORM_RENDERS,
  RECEIVE_CURRENCIES,
  RECEIVE_CURRENCIES_TO_EXPENSE,
  REFRESH_EXPENSES,
  REFRESH_TOTAL_EXPENSE,
  REMOVE_EXPENSE,
} from '../actions';

const INITIAL_STATE = {
  currencies: [], // array de string
  expenses: [], // array de objetos, com cada objeto tendo as chaves id, value, currency, method, tag, description e exchangeRates
  editor: false, // valor booleano que indica de uma despesa está sendo editada
  idToEdit: 0, // valor numérico que armazena o id da despesa que esta sendo editada
  currenciesToExpense: {},
  totalExpense: 0,
  expenseToEdit: {},
};

const wallet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case RECEIVE_CURRENCIES:
    return {
      ...state,
      currencies: action.payload,
    };
  case ADD_EXPENSE:
    return {
      ...state,
      expenses: [...state.expenses, action.payload],
    };
  case RECEIVE_CURRENCIES_TO_EXPENSE:
    return {
      ...state,
      currenciesToExpense: action.payload,
    };
  case REFRESH_TOTAL_EXPENSE:
    return {
      ...state,
      totalExpense: (action.payload === 0)
        ? Number(0).toFixed(2) : action.payload.toFixed(2),
    };
  case REMOVE_EXPENSE:
    return {
      ...state,
      expenses: state.expenses.filter((expense) => expense.id !== action.payload),
    };
  case EDIT_EXPENSE_BEGINS:
    return {
      ...state,
      editor: true,
      idToEdit: action.payload,
    };
  case EDIT_EXPENSE_CAPTURE:
    return {
      ...state,
      expenseToEdit: state.expenses[state.idToEdit],
    };
  case EDIT_EXPENSE_FORM_RENDERS:
    return {
      ...state,
    };
  case REFRESH_EXPENSES:
    return { ...state, expenses: action.payload };
  case DISABLE_EDITOR:
    return { ...state, editor: false };
  default:
    return state;
  }
};

export default wallet;
