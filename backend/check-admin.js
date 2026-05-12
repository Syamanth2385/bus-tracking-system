const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log("All users:");
    users.forEach(u => console.log(u.email, u.role));
    
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log("admin@example.com not found. Creating it...");
      admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        phone: '1234567890'
      });
      console.log("Admin created with password: password123");
    } else {
      console.log("admin@example.com exists. Setting password to password123...");
      admin.password = 'password123';
      await admin.save();
      console.log("Password updated to password123");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

checkAdmin();
