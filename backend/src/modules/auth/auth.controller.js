import User from '../../models/user.model.js';
import VerificationApplication from '../../models/verification.model.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'FARMER',
      phone,
      accountStatus: role === 'ADMIN' ? 'APPROVED' : 'PENDING_REVIEW',
    });

    if (user) {
      if (user.role !== 'ADMIN') {
        await VerificationApplication.create({
          user: user._id,
          role: user.role,
          status: 'PENDING_REVIEW',
          submittedData: { firstName, lastName, email, phone, role }
        });
      }

      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_DATA', message: 'Invalid user data' }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus || 'APPROVED',
          token: generateToken(user._id),
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};
