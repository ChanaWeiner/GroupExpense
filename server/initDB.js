import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function dropDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    console.log("📛 מסד הנתונים נמחק בהצלחה.");
    await connection.end();
  } catch (error) {
    console.error("❌ שגיאה במחיקת מסד הנתונים:", error);
  }
}

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log("✅ מסד הנתונים נוצר בהצלחה (או כבר קיים).");
    await connection.end();
  } catch (error) {
    console.error('❌ שגיאה ביצירת מסד הנתונים:', error);
  }
}

async function resetTables() {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // דוגמה לטבלת users - אפשר להוסיף או לשנות לפי הצורך
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        paypal_email VARCHAR(150)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS \`groups\` (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(255),
        created_by INT NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        user_id INT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expense_frames (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id) ON DELETE CASCADE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        frame_id INT NOT NULL,
        paid_by INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        receipt_url VARCHAR(255) DEFAULT NULL,
        note TEXT DEFAULT NULL,
        FOREIGN KEY (frame_id) REFERENCES expense_frames(id) ON DELETE CASCADE,
        FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS shopping_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        frame_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        suggested_by INT,
        amount DECIMAL(10,2) DEFAULT NULL,
        note TEXT,
        FOREIGN KEY (frame_id) REFERENCES expense_frames(id) ON DELETE CASCADE,
        FOREIGN KEY (suggested_by) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS expense_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        expense_id INT NOT NULL,
        shopping_item_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
        FOREIGN KEY (shopping_item_id) REFERENCES shopping_items(id) ON DELETE CASCADE
      );
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
        );
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
        );
      `);


    console.log('✅ הטבלאות נוצרו או עודכנו בהצלחה.');
  } catch (err) {
    console.error('❌ שגיאה ביצירת הטבלאות:', err);
  } finally {
    await dbConnection.end();
  }
}

// פונקציה ראשית להרצה מסודרת
async function main() {
  await dropDatabase();
  await createDatabase();
  await resetTables();
}

main();
