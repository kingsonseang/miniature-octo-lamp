const mongoose = require('mongoose');

const { Schema } = mongoose;

const otpSchema = Schema(
  {
    userId: { type: String, unique: true },
    code: { type: String, require: true },
    endsIn: {
      type: Date,
      default: () => {
        return new Date(Date.now() + 2 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

/**
 * Helper static method for finding otp by unique credentials
 */
otpSchema.statics.findByCredentials = async function(user_id) {
  const Otp = this;
  const otp = await Otp.findOne({ user_id });
  if (!otp) throw new Error('Unable to find Otp');

  return otp;
};

/**
 * Delete otp after use.
 */
otpSchema.methods.Invalidate = async function() {
  try {
    await this.deleteOne({ _id: this._id });
    console.log('OTP deleted successfully');
  } catch (error) {
    console.error('Error deleting OTP:', error);
  }
};

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
