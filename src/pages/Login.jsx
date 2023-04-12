import React from 'react';
import validateFields from '../helpers/validateFields';

class Login extends React.Component {
  state = {
    inputEmail: '',
    inputPassword: '',
    isButtonDisabled: true,
  };

  enableLoginButton = () => {
    const { inputEmail, inputPassword } = this.state;
    if (validateFields(inputEmail, inputPassword)) {
      this.setState({ isButtonDisabled: false });
    } else {
      this.setState({ isButtonDisabled: true });
    }
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => this.enableLoginButton());
  };

  render() {
    const { inputEmail, inputPassword, isButtonDisabled } = this.state;
    return (
      <>
        <input
          type="text"
          placeholder="E-mail"
          data-testid="email-input"
          value={ inputEmail }
          onChange={ this.handleChange }
          name="inputEmail"
        />
        <input
          type="text"
          placeholder="Senha"
          data-testid="password-input"
          value={ inputPassword }
          onChange={ this.handleChange }
          name="inputPassword"
        />
        <button
          type="submit"
          disabled={ isButtonDisabled }
        >
          Entrar
        </button>
      </>
    );
  }
}

export default Login;
