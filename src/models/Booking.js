import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 characters'],
    },
    carType: {
      type: String,
      required: [true, 'Car type is required'],
      enum: ['sedan', 'suv', 'hatchback', 'luxury'],
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
      enum: [
        'daily-magic',
        'daily-magic-luxe',
        'daily-magic-royal',
        'weekly-magic',
        'weekly-magic-luxe',
        'weekly-magic-royal',
        'alternate-magic',
        'alternate-magic-luxe',
        'alternate-magic-royal',
      ],
    },
    date: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    address: {
      type: String,
      required: [true, 'Service location is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    deviceType: {
      type: String,
      required: true,
      enum: ['ios', 'android', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookingSchema.index({ email: 1, submittedAt: -1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;

