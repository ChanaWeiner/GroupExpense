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
  } catch (error) {
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
        icon VARCHAR(255),
        created_by INT NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expense_frames (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT,
        frame_id INT,
        paid_by INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        FOREIGN KEY (frame_id) REFERENCES expense_frames(id) ON DELETE SET NULL,
        FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expense_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expense_id INT NOT NULL,
        for_user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        note TEXT,
        FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
        FOREIGN KEY (for_user_id) REFERENCES users(id) ON DELETE CASCADE
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
        FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
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
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.error('שגיאה ביצירת הטבלאות:', error);
  } finally {
    await dbConnection.end();
  }
}

async function seedData() {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // const [users] = await dbConnection.query(`
    //   INSERT INTO users (name, email, password, paypal_email)
    //   VALUES 
    //     ('חנה כהן', 'chana1@example.com', 'hashed_password1', 'chana@paypal.com'),
    //     ('שרה לוי', 'sara1@example.com', 'hashed_password2', NULL),
    //     ('רות בן דוד', 'ruth1@example.com', 'hashed_password3', 'ruth@paypal.com');
    // `);

    // const [group] = await dbConnection.query(`
    //   INSERT INTO \`groups\` (name, icon, created_by)
    //   VALUES ('טיול לצפון', '🧳', 1);
    // `);

    // await dbConnection.query(`
    //   INSERT INTO group_members (group_id, user_id, is_admin)
    //   VALUES 
    //     (1, 1, TRUE),
    //     (1, 2, FALSE),
    //     (1, 3, FALSE);
    // `);

    await dbConnection.query(`
      INSERT INTO expense_frames (group_id, name, description)
      VALUES (1, 'לינה', 'הוצאות לינה ושהייה');
    `);

    await dbConnection.query(`
      INSERT INTO expenses (group_id, frame_id, paid_by, total_amount, description, date)
      VALUES (1, 1, 1, 300.00, 'לינה בצימר', '2025-06-01');
    `);

    await dbConnection.query(`
      INSERT INTO debts (expense_id, from_user_id, to_user_id, amount)
      VALUES 
        (1, 2, 1, 100.00),
        (1, 3, 1, 100.00);
    `);

    await dbConnection.query(`
      INSERT INTO payments (from_user_id, to_user_id, amount, method, debt_id)
      VALUES 
        (2, 1, 100.00, 'paypal', 1);
    `);

    console.log('✅ נתוני דוגמה הוזנו בהצלחה!');
  } catch (error) {
    console.error('❌ שגיאה בהזנת נתונים:', error);
  } finally {
    await dbConnection.end();
  }
}

async function dropDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    await connection.query(`DROP DATABASE IF EXISTS group_expenses`);
    console.log("📛 מסד הנתונים נמחק בהצלחה.");
    await connection.end();
  } catch (error) {
    console.error("❌ שגיאה במחיקת מסד הנתונים:", error);
  }
}

// dropDatabase();
// createDatabase();
// createTables();
seedData();