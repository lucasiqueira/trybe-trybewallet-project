import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { renderWithRedux, renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import App from '../App';
import mockData from './helpers/mockData';
import expenseIdGenerator from '../helpers/expenseIdGenerator';

const initialState = {
  wallet: {
    currencies: [
      'USD',
      'CAD',
      'GBP',
      'ARS',
      'BTC',
      'LTC',
      'EUR',
      'JPY',
      'CHF',
      'AUD',
      'CNY',
      'ILS',
      'ETH',
      'XRP',
      'DOGE',
    ],
    expenses: [
      {
        id: 0,
        value: '12',
        description: 'Arroz',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Saúde',
        exchangeRates: mockData,
      },
      {
        id: 1,
        value: '6.42',
        description: 'Feijão',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
        exchangeRates: mockData,
      },
      {
        id: 2,
        value: '2.54',
        description: 'Café',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
        exchangeRates: mockData,
      },
    ],
    editor: false,
    idToEdit: 0,
    totalExpense: '103.07',
    expenseToEdit: {},
  },
};

const getFormElements = () => {
  const descriptionInput = screen.getByLabelText(/descrição da despesa/i);
  const tagInput = screen.getByLabelText(/categoria da despesa/i);
  const valueInput = screen.getByLabelText(/valor/i);
  const methodInput = screen.getByLabelText(/método de pagamento/i);
  const currencyInput = screen.getByLabelText(/moeda/i);
  const addExpenseButton = screen.getByRole('button', { name: /adicionar despesa/i });
  return {
    descriptionInput,
    tagInput,
    valueInput,
    methodInput,
    currencyInput,
    addExpenseButton,
  };
};

describe('Página da Carteira', () => {
  test('Verifica se existem todos os elementos do formulário de despesas', () => {
    renderWithRedux(<Wallet />);

    const { descriptionInput,
      tagInput,
      valueInput,
      methodInput,
      currencyInput,
      addExpenseButton } = getFormElements();

    expect(descriptionInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
    expect(valueInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(currencyInput).toBeInTheDocument();
    expect(addExpenseButton).toBeInTheDocument();
  });

  test('Adiciona uma despesa ao estado global', async () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });
    const { descriptionInput,
      tagInput,
      valueInput,
      methodInput,
      addExpenseButton,
      currencyInput } = getFormElements();

    expect(store.getState().wallet.totalExpense).toBe(0);

    userEvent.type(descriptionInput, 'Cinema de quarta');
    userEvent.selectOptions(tagInput, 'Lazer');
    userEvent.type(valueInput, 15);
    waitFor(() => {
      userEvent.selectOptions(currencyInput, 'EUR');
    });
    userEvent.selectOptions(methodInput, 'Cartão de crédito');
    userEvent.click(addExpenseButton);

    const totalExpense = screen.getByTestId('total-field');

    expect(totalExpense.value).not.toBe(0);

    const deleteButton = await screen.findByTestId('delete-btn-0');
    console.log(deleteButton);
    userEvent.click(deleteButton);
  });

  test('Verifica a adição de duas despesas à tabela e exclusão da primeira', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'], initialState });

    expect(screen.getByText(/Descrição da Despesa/i)).toBeInTheDocument();

    const firstRowDescription = screen.getByText(/arroz/i);
    const secondRowDescription = screen.getByRole('cell', { name: /café/i });
    const thirdRowDescription = screen.getByRole('cell', { name: /feijão/i });
    expect(firstRowDescription).toBeInTheDocument();
    expect(secondRowDescription).toBeInTheDocument();
    expect(thirdRowDescription).toBeInTheDocument();
    const deleteButtons = await screen.findAllByTestId('delete-btn');
    expect(deleteButtons).toHaveLength(3);
    const firstDeleteButton = screen.queryByTestId('delete-btn-0');
    const secondDeleteButton = screen.queryByTestId('delete-btn-1');
    const thirdDeleteButton = screen.queryByTestId('delete-btn-2');
    userEvent.click(firstDeleteButton);
    userEvent.click(secondDeleteButton);
    userEvent.click(thirdDeleteButton);
    waitFor(() => {
      expect(screen.queryByText(/arroz/i)).not.toBeInTheDocument();
    });
  });

  test('Verifica a edição de tuplas', async () => {
    renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'], initialState });

    const editButtons = await screen.findAllByTestId('edit-btn');
    expect(editButtons).toHaveLength(3);
    const firstEditButton = screen.queryByTestId('edit-btn-0');
    userEvent.click(firstEditButton);
    const { descriptionInput } = getFormElements();
    userEvent.type(descriptionInput, 'Melancia');
    const saveEditionButton = screen.getByRole('button', {
      name: /editar despesa/i,
    });
    userEvent.click(saveEditionButton);

    waitFor(() => {
      expect(screen.queryByText(/arroz/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/melancia/i)).toBeInTheDocument();
    });
  });

  test('Verifica a geração de ID para itens na lista', () => {
    const expenses = [
      { id: 0 }, { id: 2 }, { id: 6 },
    ];
    const newId = expenseIdGenerator(expenses);
    expect(newId).toBe(7);

    const firstId = expenseIdGenerator([]);
    expect(firstId).toBe(0);
  });
});
