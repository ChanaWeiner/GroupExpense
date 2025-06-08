import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// יצירת חיבור למסד נתונים
const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
});

// בדיקת התחברות
db.connect((err) => {
  if (err) {
    console.error('שגיאה בחיבור למסד נתונים:', err);
  } else {
    console.log('✓ התחברת בהצלחה ל-MySQL');
  }
});

// ראוט בסיסי לבדיקה
app.get('/', (req, res) => {
  res.send('ברוך הבא לשרת!');
});

// ראוט לדוגמה שמחזיר את כל המשתמשים
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('שגיאה בשליפת משתמשים:', err);
      res.status(500).send('שגיאה בשליפת משתמשים');
    } else {
      res.json(results);
    }
  });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
});
