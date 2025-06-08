import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS group_expenses`);

        await connection.end();
    }
    catch (error) {
        console.error('שגיאה ביצירת מסד הנתונים:', error);
    }
}

async function createTables() {
    const dbConnection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
    try {
        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    paypal_email VARCHAR(150)
  )
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS \`groups\` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS group_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL,
    user_id INT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (group_id) REFERENCES \`groups\`(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT,
    paid_by INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (group_id) REFERENCES \`groups\`(id),
    FOREIGN KEY (paid_by) REFERENCES users(id)
  )
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS expense_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT NOT NULL,
    for_user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (for_user_id) REFERENCES users(id)
  )
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS debts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    expense_id INT,
    from_user_id INT NOT NULL,
    to_user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME,
    status ENUM('open', 'paid') DEFAULT 'open',
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
  )
`);

        await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    from_user_id INT NOT NULL,
    to_user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('paypal', 'cash', 'other') NOT NULL,
    debt_id INT,
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id),
    FOREIGN KEY (debt_id) REFERENCES debts(id)
  )
`);
    }
    catch (error) {
        console.error('שגיאה ביצירת הטבלאות:', error);
    } finally {
        await dbConnection.end();
    }
}

// createDatabase();
// createTables();
