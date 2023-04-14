import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { renderWithRedux, renderWithRouterAndRedux } from './helpers/renderWith';
import Wallet from '../pages/Wallet';
import App from '../App';
import { logIn } from './Login.test';

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

  test('Adiciona uma despesa ao estado global', () => {
    const { store } = renderWithRouterAndRedux(<App />);
    logIn();
    const { descriptionInput,
      tagInput,
      valueInput,
      methodInput,
      addExpenseButton } = getFormElements();

    expect(store.getState().wallet.totalExpense).toBe(0);

    userEvent.type(descriptionInput, 'Cinema de quarta');
    userEvent.selectOptions(tagInput, 'Lazer');
    userEvent.type(valueInput, 15);
    userEvent.selectOptions(methodInput, 'Cartão de crédito');
    userEvent.click(addExpenseButton);
    console.log(store.getState());

    const totalExpense = screen.getByTestId('total-field');

    expect(totalExpense.value).not.toBe(0);
  });

  test('Verifica a adição de duas despesas à tabela e exclusão da primeira', async () => {
    renderWithRouterAndRedux(<App />);
    logIn();

    const { descriptionInput,
      valueInput,
      addExpenseButton } = getFormElements();

    userEvent.type(valueInput, 15);
    userEvent.type(descriptionInput, 'Arroz');
    console.log(descriptionInput.value);
    userEvent.click(addExpenseButton);

    userEvent.type(valueInput, 12);
    userEvent.clear(descriptionInput);
    userEvent.type(descriptionInput, 'Feijão');

    userEvent.click(addExpenseButton);
    await waitFor(() => {
      const firstRowDescription = screen.getByRole('cell', { name: /arroz/i });
      const secondRowDescription = screen.getByRole('cell', { name: /feijão/i });
      const deleteButtons = screen.getAllByTestId('delete-btn');
      expect(firstRowDescription).toBeInTheDocument();
      expect(secondRowDescription).toBeInTheDocument();
      console.log(deleteButtons);
    });
  });
});
