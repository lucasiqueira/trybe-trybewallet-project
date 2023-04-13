import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import logoTrybeWallet from '../assets/svg/logo-trybewallet.svg';
import coinsIcon from '../assets/svg/coins-icon.svg';
import profileIcon from '../assets/svg/profile-icon.svg';
import '../assets/styles/Header.css';

class Header extends Component {
  render() {
    const { email, totalExpense } = this.props;
    return (
      <header>
        <img src={ logoTrybeWallet } alt="Logo da TrybeWallet" className="header-logo" />
        <div className="info-header">
          <img src={ coinsIcon } className="icon-header" alt="Icone de moedas" />
          <div className="total-expenses-div">
            <span className="label-header">Total de despesas:</span>
            <span data-testid="total-field">{totalExpense}</span>
            <span data-testid="header-currency-field">BRL</span>
          </div>
        </div>
        <div className="info-header">
          <img src={ profileIcon } className="icon-header" alt="Icone de perfil" />
          <span data-testid="email-field" className="email-field">{email}</span>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  totalExpense: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  totalExpense: state.wallet.totalExpense,
});

export default connect(mapStateToProps)(Header);
