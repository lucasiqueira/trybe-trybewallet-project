import { CURRENCY_ENDPOINT } from '../../constants';

export const SAVE_EMAIL = 'SAVE_EMAIL';
export const FETCH_CURRENCIES_STARTED = 'FETCH_CURRENCIES_STARTED';
export const RECEIVE_CURRENCIES = 'RECEIVE_CURRENCIES';

export const saveEmail = (email) => ({
  type: SAVE_EMAIL,
  payload: email,
});

export const fetchCurrenciesStarted = () => ({
  type: FETCH_CURRENCIES_STARTED,
});

export const receiveCurrencies = (currencies) => ({
  type: RECEIVE_CURRENCIES,
  currencies,
});

export const fetchCurrencies = () => async (dispatch) => {
  dispatch(fetchCurrenciesStarted());
  const response = await fetch(CURRENCY_ENDPOINT);
  const data = await response.json();
  const coins = Object.keys(data).filter((coin) => coin !== 'USDT');
  dispatch(receiveCurrencies(coins));
};
