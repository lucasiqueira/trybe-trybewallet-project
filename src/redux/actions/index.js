import { CURRENCY_ENDPOINT } from '../../constants';

export const SAVE_EMAIL = 'SAVE_EMAIL';
export const FETCH_CURRENCIES_STARTED = 'FETCH_CURRENCIES_STARTED';
export const RECEIVE_CURRENCIES = 'RECEIVE_CURRENCIES';
export const ADD_EXPENSE = 'ADD_EXPENSE';
export const RECEIVE_CURRENCIES_TO_EXPENSE = 'RECEIVE_CURRENCIES_TO_EXPENSE';
export const REFRESH_TOTAL_EXPENSE = 'REFRESH_TOTAL_EXPENSE';

export const saveEmail = (email) => ({
  type: SAVE_EMAIL,
  payload: email,
});

export const fetchCurrenciesStarted = () => ({
  type: FETCH_CURRENCIES_STARTED,
});

export const receiveCurrencies = (currencies) => ({
  type: RECEIVE_CURRENCIES,
  payload: currencies,
});

export const receiveCurrenciesToExpense = (currencies) => ({
  type: RECEIVE_CURRENCIES_TO_EXPENSE,
  payload: currencies,
});

export const fetchCurrencies = () => async (dispatch) => {
  dispatch(fetchCurrenciesStarted());
  const response = await fetch(CURRENCY_ENDPOINT);
  const data = await response.json();
  const coins = Object.keys(data).filter((coin) => coin !== 'USDT');
  dispatch(receiveCurrencies(coins));
};

export const fetchCurrenciesToExpense = () => async (dispatch) => {
  dispatch(fetchCurrenciesStarted());
  const response = await fetch(CURRENCY_ENDPOINT);
  const data = await response.json();
  dispatch(receiveCurrenciesToExpense(data));
};

export const addExpense = (expense) => ({
  type: ADD_EXPENSE,
  payload: expense,
});

export const refreshTotalExpense = (total) => ({
  type: REFRESH_TOTAL_EXPENSE,
  payload: Number(total),
});
