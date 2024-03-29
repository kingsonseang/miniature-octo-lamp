const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = Schema(
  {
    username: { type: String, unique: true, required: false },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
      middle: String,
      suffix: String,
    },
    email: { type: String, unique: true },
    password: String,
    phone: { type: String, unique: true, required: false },
    emailVerified: { type: Boolean, default: false },
    role: {
      type: String,
      default: 'unverfied',
      enum: ['unverfied', 'verified', 'admin', 'superadmin'],
    },
    tokens: [{ token: { type: String, required: true } }],
    publicIds: [
      {
        publicId: { type: String, required: true },
        relatedToken: { type: String, required: true },
      },
    ],
    liked: { type: Array, required: false },
    views: [
      {
        recipe: { type: String, required: true },
        __v: { type: Number, required: true, default: 1 },
      },
    ],
    cooked: { type: Array, required: false },
    cuisine: { type: Array, required: false },
    excludeCuisine: { type: Array, required: false },
    diet: { type: Array, required: false },
    intolerances: { type: Array, required: false },
    profile_picture: { type: String, required: false },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

/**
 * Hide properties of Mongoose User object.
 */
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  if (!userObject.role === 'superadmin') {
    delete userObject.updatedAt;
    delete userObject.__v;
  }
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

/**
 * Helper method for generating Auth Token
 */
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

/**
 * Helper static method for finding user by credentials
 */
userSchema.statics.findByCredentials = async function(email, password) {
  const User = this;
  const user = await User.findOne({ email });
  
  if (!user) return { isMatch: false, exists: false };

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return { isMatch: false, exists: true };

  return { isMatch: true, exists: true, user: user };
};

/**
 * Helper static method for finding user by email
 */
userSchema.statics.findByEmail = async function(email) {
  const User = this;
  const user = await User.findOne({ email });
  if (!user) throw new Error('Unable to find user');

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
