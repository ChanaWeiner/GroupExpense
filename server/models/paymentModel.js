export const insertPayment = async (connection, { from_user_id, to_user_id, amount, method, debt_id }) => {
  await connection.query(
    `INSERT INTO payments (from_user_id, to_user_id, amount, method, debt_id, paid_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [from_user_id, to_user_id, amount, method, debt_id]
  );
};
