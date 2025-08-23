import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User, sequelize } = db;

// Register a new user
export const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, phone_number, password, cnic } = req.body;

    // Validate required fields
    if (!email || !phone_number || !password) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Missing required fields: email, phone_number, password' });
    }

    // Validate CNIC format (if provided)
    if (cnic && !/^\d{13}$/.test(cnic)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid CNIC: must be exactly 13 digits' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if CNIC already exists (if provided and unique constraint exists)
    if (cnic) {
      const existingCnic = await User.findOne({ where: { cnic }, transaction });
      if (existingCnic) {
        await transaction.rollback();
        return res.status(400).json({ error: 'CNIC already registered' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone_number,
      password: hashedPassword,
      cnic,
      created_at: new Date(),
    }, { transaction });

    await transaction.commit();

    // Return response (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        cnic: user.cnic,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering user:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Failed to register user',
        details: `Unique constraint violation: ${error.errors.map(e => `${e.path} (${e.value}) already exists`).join(', ')}`,
      });
    }
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, password' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return response
    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        cnic: user.cnic,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login', details: error.message });
  }
};


