import jwt from 'jsonwebtoken';

export const verifyOwnerToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach owner details to req.owner
    req.owner = {
      owner_id: decoded.owner_id,
      username: decoded.username,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      phone_number: decoded.phone_number,
    };

    next();
  } catch (error) {
    console.error('Error verifying owner token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};