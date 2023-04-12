import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validateFields from '../helpers/validateFields';
import { saveEmail } from '../redux/actions';
import '../assets/styles/Login.css';
import logoTrybeWallet from '../assets/svg/logo-trybewallet.svg';

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

  handleLoginButton = () => {
    const { inputEmail } = this.state;
    const { dispatch, history } = this.props;
    dispatch(saveEmail(inputEmail));
    history.push('/carteira');
  };

  render() {
    const { inputEmail, inputPassword, isButtonDisabled } = this.state;
    return (
      <section className="login-page">
        <div className="login-container">
          <img
            src={ logoTrybeWallet }
            alt="Logo da TrybeWallet"
            className="logo"
          />
          <input
            type="text"
            placeholder="E-mail"
            data-testid="email-input"
            value={ inputEmail }
            onChange={ this.handleChange }
            name="inputEmail"
            className="input-email login-input"
          />
          <input
            type="text"
            placeholder="Senha"
            data-testid="password-input"
            value={ inputPassword }
            onChange={ this.handleChange }
            name="inputPassword"
            className="input-password login-input"
          />
          <button
            type="submit"
            disabled={ isButtonDisabled }
            onClick={ this.handleLoginButton }
            className="login-button"
          >
            Entrar
          </button>
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect()(Login);
