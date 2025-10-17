import { Hono } from 'hono';
import Admin from '../models/Admin.js';

const auth = new Hono();

// Login endpoint
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    // Validate input
    if (!username || !password) {
      return c.json({
        success: false,
        error: 'Username and password are required'
      }, 400);
    }

    // Find admin user
    const admin = await Admin.findOne({ username: username.trim() });

    if (!admin) {
      return c.json({
        success: false,
        error: 'Invalid username or password'
      }, 401);
    }

    // Check if account is locked
    if (admin.isLocked()) {
      const lockTimeRemaining = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      return c.json({
        success: false,
        error: `Account is locked. Try again in ${lockTimeRemaining} minutes.`
      }, 423);
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return c.json({
        success: false,
        error: 'Invalid username or password'
      }, 401);
    }

    // Reset login attempts and update last login
    await admin.resetLoginAttempts();

    // Generate session token (simple token for now)
    const sessionToken = Buffer.from(`${admin._id}:${Date.now()}`).toString('base64');
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Log successful login
    console.log(`✅ Admin login successful: ${admin.username} at ${new Date().toISOString()}`);

    return c.json({
      success: true,
      data: {
        token: sessionToken,
        expiryTime,
        username: admin.username,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return c.json({
      success: false,
      error: 'An error occurred during login'
    }, 500);
  }
});

// Verify token endpoint
auth.post('/verify', async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({
        success: false,
        error: 'Token is required'
      }, 400);
    }

    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId, timestamp] = decoded.split(':');

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      return c.json({
        success: false,
        error: 'Token expired'
      }, 401);
    }

    // Verify admin exists
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return c.json({
        success: false,
        error: 'Invalid token'
      }, 401);
    }

    return c.json({
      success: true,
      data: {
        username: admin.username,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    return c.json({
      success: false,
      error: 'Invalid token'
    }, 401);
  }
});

// Change password endpoint
auth.post('/change-password', async (c) => {
  try {
    const { token, currentPassword, newPassword } = await c.req.json();

    if (!token || !currentPassword || !newPassword) {
      return c.json({
        success: false,
        error: 'All fields are required'
      }, 400);
    }

    // Validate new password
    if (newPassword.length < 8) {
      return c.json({
        success: false,
        error: 'New password must be at least 8 characters'
      }, 400);
    }

    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId] = decoded.split(':');

    // Find admin
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return c.json({
        success: false,
        error: 'Invalid token'
      }, 401);
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      return c.json({
        success: false,
        error: 'Current password is incorrect'
      }, 401);
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    console.log(`✅ Password changed for admin: ${admin.username}`);

    return c.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('❌ Password change error:', error);
    return c.json({
      success: false,
      error: 'An error occurred while changing password'
    }, 500);
  }
});

// Get admin info endpoint
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({
        success: false,
        error: 'No token provided'
      }, 401);
    }

    const token = authHeader.substring(7);

    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [adminId] = decoded.split(':');

    // Find admin
    const admin = await Admin.findById(adminId).select('-password');

    if (!admin) {
      return c.json({
        success: false,
        error: 'Admin not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      }
    });

  } catch (error) {
    console.error('❌ Get admin info error:', error);
    return c.json({
      success: false,
      error: 'An error occurred'
    }, 500);
  }
});

export default auth;

