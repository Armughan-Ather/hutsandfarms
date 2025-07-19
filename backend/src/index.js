import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

import app from './app.js';
import db from './models/index.js';

const PORT = process.env.PORT || 3000;

try {
  await db.sequelize.authenticate();
  console.log('✅ DB connected successfully.');

  await db.sequelize.sync({ alter: true });
  console.log('✅ Models synced with database.');

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('❌ Unable to connect to the database:', err);
}