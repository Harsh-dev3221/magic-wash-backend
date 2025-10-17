import { Hono } from 'hono';
import Booking from '../models/Booking.js';

const app = new Hono();

// @route   POST /
// @desc    Create a new booking
// @access  Public
app.post('/', async (c) => {
  try {
    const bookingData = await c.req.json();

    console.log('📝 New Booking Request Received:');
    console.log('================================');
    console.log('Name:', bookingData.name);
    console.log('Email:', bookingData.email);
    console.log('Phone:', bookingData.phone);
    console.log('Car Type:', bookingData.carType);
    console.log('Service Type:', bookingData.serviceType);
    console.log('Date:', bookingData.date);
    console.log('Address:', bookingData.address);
    console.log('Device Type:', bookingData.deviceType);
    console.log('Notes:', bookingData.notes || 'None');
    console.log('================================\n');

    // Create new booking
    const booking = new Booking(bookingData);
    await booking.save();

    console.log('✅ Booking saved to database with ID:', booking._id);

    return c.json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    }, 201);
  } catch (error) {
    console.error('❌ Error creating booking:', error.message);

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
      message: 'Server error while creating booking',
      error: error.message,
    }, 500);
  }
});

// @route   GET /
// @desc    Get all bookings
// @access  Public (should be protected in production)
app.get('/', async (c) => {
  try {
    const { status, limit = '50', page = '1' } = c.req.query();

    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(query);

    console.log(`📊 Retrieved ${bookings.length} bookings from database`);

    return c.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: bookings,
    });
  } catch (error) {
    console.error('❌ Error fetching bookings:', error.message);
    return c.json({
      success: false,
      message: 'Server error while fetching bookings',
      error: error.message,
    }, 500);
  }
});

// @route   GET /:id
// @desc    Get single booking by ID
// @access  Public (should be protected in production)
app.get('/:id', async (c) => {
  try {
    const booking = await Booking.findById(c.req.param('id'));

    if (!booking) {
      return c.json({
        success: false,
        message: 'Booking not found',
      }, 404);
    }

    return c.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('❌ Error fetching booking:', error.message);
    return c.json({
      success: false,
      message: 'Server error while fetching booking',
      error: error.message,
    }, 500);
  }
});

// @route   PUT /:id
// @desc    Update booking status
// @access  Public (should be protected in production)
app.put('/:id', async (c) => {
  try {
    const { status } = await c.req.json();

    const booking = await Booking.findByIdAndUpdate(
      c.req.param('id'),
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return c.json({
        success: false,
        message: 'Booking not found',
      }, 404);
    }

    console.log(`✅ Booking ${booking._id} status updated to: ${status}`);

    return c.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('❌ Error updating booking:', error.message);
    return c.json({
      success: false,
      message: 'Server error while updating booking',
      error: error.message,
    }, 500);
  }
});

// @route   DELETE /:id
// @desc    Delete a booking
// @access  Public (should be protected in production)
app.delete('/:id', async (c) => {
  try {
    const booking = await Booking.findByIdAndDelete(c.req.param('id'));

    if (!booking) {
      return c.json({
        success: false,
        message: 'Booking not found',
      }, 404);
    }

    console.log(`🗑️ Booking ${booking._id} deleted`);

    return c.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting booking:', error.message);
    return c.json({
      success: false,
      message: 'Server error while deleting booking',
      error: error.message,
    }, 500);
  }
});

export default app;

