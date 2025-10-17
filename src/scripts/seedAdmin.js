import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Username:', existingAdmin.username);
      console.log('📅 Created:', existingAdmin.createdAt);
      
      // Ask if user wants to reset password
      console.log('\n💡 To reset password, delete the admin user first:');
      console.log('   db.admins.deleteOne({ username: "admin" })');
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create default admin user
    console.log('\n🔐 Creating default admin user...');
    
    const admin = new Admin({
      username: 'admin',
      password: 'magicwash@admin', // Will be hashed automatically
      email: 'admin@magicwash.com',
      role: 'admin',
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Username: admin');
    console.log('🔑 Password: magicwash@admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('💡 Password is securely hashed with bcrypt (12 rounds)');
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();

