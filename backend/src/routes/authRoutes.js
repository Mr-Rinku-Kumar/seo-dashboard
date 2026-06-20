// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, updateUser, deleteUser } = require('../controllers/authController');
const { protect, authorize, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Admin only routes - User management
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;