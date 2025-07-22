import bcrypt from 'bcrypt';
import db from '../models/index.js';
 const { Owner } = db;

export const addOwner = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await Owner.create({
      first_name,
      last_name,
      email,
      phone_number,
      username,
      password: hashedPassword,
      created_at: new Date(),
    });

    res.status(201).json({ message: 'Owner created successfully', owner });
  } catch (error) {
    console.error('Error adding owner:', error);
    res.status(500).json({ error: 'Failed to add owner' });
  }
};