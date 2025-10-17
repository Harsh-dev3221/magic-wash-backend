import mongoose from 'mongoose';

const partnershipSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
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
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      minlength: [2, 'City must be at least 2 characters'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      minlength: [6, 'Pincode must be at least 6 characters'],
    },
    investmentCapacity: {
      type: String,
      required: [true, 'Investment capacity is required'],
      enum: [
        '₹0-2 Lakhs',
        '₹2-5 Lakhs',
        '₹5-10 Lakhs',
        '₹10-15 Lakhs',
        '₹15-20 Lakhs',
        '₹20-30 Lakhs',
        '₹30+ Lakhs',
      ],
    },
    businessExperience: {
      type: String,
      trim: true,
      default: '',
    },
    preferredLocation: {
      type: String,
      required: [true, 'Preferred location is required'],
      trim: true,
      minlength: [3, 'Preferred location must be at least 3 characters'],
    },
    comments: {
      type: String,
      trim: true,
      default: '',
    },
    callSchedule: {
      type: String,
      required: [true, 'Call schedule is required'],
      enum: ['Morning (9AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-7PM)'],
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'approved', 'rejected'],
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
partnershipSchema.index({ email: 1, submittedAt: -1 });
partnershipSchema.index({ status: 1 });
partnershipSchema.index({ city: 1 });

const Partnership = mongoose.model('Partnership', partnershipSchema);

export default Partnership;

