import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import App from '../App';
import Login from '../pages/Login';

const TEST_EMAIL = 'email@email.com';

export const logIn = () => {
  const emailInput = screen.getByPlaceholderText(/e-mail/i);
  const passwordInput = screen.getByPlaceholderText(/senha/i);
  const loginButton = screen.getByRole('button', { name: /entrar/i });
  userEvent.type(emailInput, TEST_EMAIL);
  userEvent.type(passwordInput, '123456');
  userEvent.click(loginButton);
};

describe('Página de Login', () => {
  test('Verifica se a página de login é renderizada como página inicial', () => {
    renderWithRouterAndRedux(<App />);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    const logoImage = screen.getByRole('img', { name: /logo da trybewallet/i });
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    expect(loginButton).toBeInTheDocument();
    expect(logoImage).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('Verifica se o botão é habilitado somente quando as regras de validação forem atendidas', () => {
    renderWithRouterAndRedux(<Login />);
    const emailInput = screen.getByPlaceholderText(/e-mail/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    userEvent.type(emailInput, TEST_EMAIL);
    expect(loginButton).toBeDisabled();
    userEvent.type(passwordInput, '12345');
    expect(loginButton).toBeDisabled();
    userEvent.type(passwordInput, '123456');
    expect(loginButton).not.toBeDisabled();
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'email');
    expect(loginButton).toBeDisabled();
    userEvent.type(emailInput, TEST_EMAIL);
    expect(loginButton).not.toBeDisabled();
  });

  test('Testa se o usuário é direcionado para a página da Carteira após o Login', () => {
    renderWithRouterAndRedux(<App />);
    logIn();

    const totalExpenses = screen.getByText(/total de despesas:/i);
    expect(totalExpenses).toBeInTheDocument();
  });
});
