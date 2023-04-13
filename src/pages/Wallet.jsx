import React from 'react';
import Header from '../components/Header';
import WalletForm from '../components/WalletForm';
import ExpenseButtonSection from '../components/ExpenseButtonSection';

class Wallet extends React.Component {
  render() {
    return (
      <>
        <section>
          <Header />
          <WalletForm />
          <ExpenseButtonSection />
        </section>
        <p>Carteira</p>
      </>
    );
  }
}

export default Wallet;
