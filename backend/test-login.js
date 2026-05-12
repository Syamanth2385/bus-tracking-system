const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'vedasbharatindia118@gmail.com' });
    console.log("User exists:", !!user);
    if (user) {
      console.log("Hashed password:", user.password);
      const isMatch = await user.matchPassword('123456'); // Try the most likely test password
      console.log("Matches '123456':", isMatch);
    }
  } catch (err) {
    console.error("Raw Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

test();
