const expenseIdGenerator = (expenses) => {
  const higherIndex = expenses.reduce((acc, exp) => ((exp.id > acc) ? exp.id : acc), 0);
  return expenses.length === 0 ? 0 : higherIndex + 1;
};

export default expenseIdGenerator;
