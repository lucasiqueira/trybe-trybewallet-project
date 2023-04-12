import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validateFields from '../helpers/validateFields';
import { saveEmail } from '../redux/actions';

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
    const { dispatch } = this.props;
    dispatch(saveEmail(inputEmail));
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
          onClick={ this.handleLoginButton }
        >
          Entrar
        </button>
      </>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Login);
