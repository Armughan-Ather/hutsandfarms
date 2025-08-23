// import bcrypt from 'bcrypt';
// import db from '../models/index.js';
//  const { Owner } = db;

// export const addOwner = async (req, res) => {
//   try {
//     const { first_name, last_name, email, phone_number, username, password } = req.body;

//     if (!email || !username || !password) {
//       return res.status(400).json({ error: 'Email, username, and password are required' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const owner = await Owner.create({
//       first_name,
//       last_name,
//       email,
//       phone_number,
//       username,
//       password: hashedPassword,
//       created_at: new Date(),
//     });

//     res.status(201).json({ message: 'Owner created successfully', owner });
//   } catch (error) {
//     console.error('Error adding owner:', error);
//     res.status(500).json({ error: 'Failed to add owner' });
//   }
// };



import bcrypt from 'bcrypt';
import db from '../models/index.js';

const { Owner, sequelize } = db;

// Add a new owner
export const addOwner = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { first_name, last_name, email, phone_number, username, password } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Missing required fields: email, username, password' });
    }

    // Check if email already exists
    const existingEmail = await Owner.findOne({ where: { email }, transaction });
    if (existingEmail) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if username already exists
    const existingUsername = await Owner.findOne({ where: { username }, transaction });
    if (existingUsername) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await Owner.create({
      first_name,
      last_name,
      email,
      phone_number,
      username,
      password: hashedPassword,
      created_at: new Date(),
    }, { transaction });

    await transaction.commit();

    // Return response (excluding password)
    res.status(201).json({
      message: 'Owner created successfully',
      owner: {
        owner_id: owner.owner_id,
        first_name: owner.first_name,
        last_name: owner.last_name,
        email: owner.email,
        phone_number: owner.phone_number,
        username: owner.username,
        created_at: owner.created_at,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error adding owner:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Failed to add owner',
        details: `Unique constraint violation: ${error.errors.map(e => `${e.path} (${e.value}) already exists`).join(', ')}`,
      });
    }
    res.status(500).json({ error: 'Failed to add owner', details: error.message });
  }
};