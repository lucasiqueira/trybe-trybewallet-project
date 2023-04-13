import React, { Component } from 'react';
import '../assets/styles/ExpenseButtonSection.css';

class ExpenseButtonSection extends Component {
  render() {
    return (
      <section className="add-expense-section">
        <button className="add-expense-button">Adicionar despesa</button>
      </section>
    );
  }
}

export default ExpenseButtonSection;
