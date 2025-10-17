import { Hono } from 'hono';
import Partnership from '../models/Partnership.js';

const app = new Hono();

// @route   POST /
// @desc    Create a new partnership application
// @access  Public
app.post('/', async (c) => {
  try {
    const partnershipData = await c.req.json();

    console.log('🤝 New Partnership Application Received:');
    console.log('=========================================');
    console.log('Full Name:', partnershipData.fullName);
    console.log('Email:', partnershipData.email);
    console.log('Phone:', partnershipData.phone);
    console.log('City:', partnershipData.city);
    console.log('Pincode:', partnershipData.pincode);
    console.log('Investment Capacity:', partnershipData.investmentCapacity);
    console.log('Preferred Location:', partnershipData.preferredLocation);
    console.log('Call Schedule:', partnershipData.callSchedule);
    console.log('Business Experience:', partnershipData.businessExperience || 'None provided');
    console.log('Comments:', partnershipData.comments || 'None');
    console.log('=========================================\n');

    // Create new partnership application
    const partnership = new Partnership(partnershipData);
    await partnership.save();

    console.log('✅ Partnership application saved to database with ID:', partnership._id);

    return c.json({
      success: true,
      message: 'Partnership application submitted successfully',
      data: partnership,
    }, 201);
  } catch (error) {
    console.error('❌ Error creating partnership application:', error.message);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return c.json({
        success: false,
        message: 'Validation error',
        errors,
      }, 400);
    }

    return c.json({
      success: false,
      message: 'Server error while creating partnership application',
      error: error.message,
    }, 500);
  }
});

// @route   GET /
// @desc    Get all partnership applications
// @access  Public (should be protected in production)
app.get('/', async (c) => {
  try {
    const { status, city, limit = '50', page = '1' } = c.req.query();

    const query = {};
    if (status) query.status = status;
    if (city) query.city = new RegExp(city, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const partnerships = await Partnership.find(query)
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Partnership.countDocuments(query);

    console.log(`📊 Retrieved ${partnerships.length} partnership applications from database`);

    return c.json({
      success: true,
      count: partnerships.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: partnerships,
    });
  } catch (error) {
    console.error('❌ Error fetching partnership applications:', error.message);
    return c.json({
      success: false,
      message: 'Server error while fetching partnership applications',
      error: error.message,
    }, 500);
  }
});

// @route   GET /:id
// @desc    Get single partnership application by ID
// @access  Public (should be protected in production)
app.get('/:id', async (c) => {
  try {
    const partnership = await Partnership.findById(c.req.param('id'));

    if (!partnership) {
      return c.json({
        success: false,
        message: 'Partnership application not found',
      }, 404);
    }

    return c.json({
      success: true,
      data: partnership,
    });
  } catch (error) {
    console.error('❌ Error fetching partnership application:', error.message);
    return c.json({
      success: false,
      message: 'Server error while fetching partnership application',
      error: error.message,
    }, 500);
  }
});

// @route   PUT /:id
// @desc    Update partnership application status
// @access  Public (should be protected in production)
app.put('/:id', async (c) => {
  try {
    const { status } = await c.req.json();

    const partnership = await Partnership.findByIdAndUpdate(
      c.req.param('id'),
      { status },
      { new: true, runValidators: true }
    );

    if (!partnership) {
      return c.json({
        success: false,
        message: 'Partnership application not found',
      }, 404);
    }

    console.log(`✅ Partnership application ${partnership._id} status updated to: ${status}`);

    return c.json({
      success: true,
      message: 'Partnership application updated successfully',
      data: partnership,
    });
  } catch (error) {
    console.error('❌ Error updating partnership application:', error.message);
    return c.json({
      success: false,
      message: 'Server error while updating partnership application',
      error: error.message,
    }, 500);
  }
});

// @route   DELETE /:id
// @desc    Delete a partnership application
// @access  Public (should be protected in production)
app.delete('/:id', async (c) => {
  try {
    const partnership = await Partnership.findByIdAndDelete(c.req.param('id'));

    if (!partnership) {
      return c.json({
        success: false,
        message: 'Partnership application not found',
      }, 404);
    }

    console.log(`🗑️ Partnership application ${partnership._id} deleted`);

    return c.json({
      success: true,
      message: 'Partnership application deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting partnership application:', error.message);
    return c.json({
      success: false,
      message: 'Server error while deleting partnership application',
      error: error.message,
    }, 500);
  }
});

export default app;

