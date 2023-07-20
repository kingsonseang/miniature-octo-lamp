const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const auth = require('../../config/auth');
const sendOtp = require('../../utils/sendOtp');
const generateOTP = require('../../utils/genetateOtp');

/**
 * @route   POST /auth/register
 * @desc    register a user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const email_exist = await User.findOne({ email: email });
    const phone_exist = await User.findOne({ phone: phone });

    if (email_exist) {
      return res.status(409).send({
        error: { message: 'You have entered an email associated with another account.' },
      });
    }

    if (phone_exist) {
      return res.status(409).send({
        error: { message: 'You have entered a phone number associated with another account.' },
      });
    }

    const user = new User(req.body);

    let num = generateOTP();

    // Generate a 6-digit OTP
    const otp = new Otp({ userId: user._id, code: num });

    // Send the OTP as mail
    const sendNewUserOtp = await sendOtp(user?.email, otp?.code);

    if (!sendNewUserOtp?.sent) {
      return res.send({
        user: true,
        error: true,
        token: false,
        message:
          'an error occured when sending verification mail pls try to re-login or contact support.',
      });
    }

    await otp.save();
    await user.save();

    const token = await user.generateAuthToken();

    return res.send({
      user: true,
      error: false,
      message: 'Account created successfully.',
      token: token,
    });
  } catch (e) {
    res.status(400).send({
      error: { message: 'An error occured on the server', error: e },
    });
  }
});

/**
 * @route   POST /auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);

    const user = await User.findByCredentials(email, password);

    if (!user?.emailVerified) {
      // Delete token if any
      const oldToken = await Otp.deleteMany({ userId: user._id });

      let num = generateOTP();

      // Generate a 6-digit OTP
      const otp = new Otp({ userId: user._id, code: num });

      // Send the OTP as mail
      const sendNewUserOtp = await sendOtp(user?.email, otp?.code);

      if (!sendNewUserOtp?.sent) {
        return res.send({
          user: true,
          error: true,
          token: false,
          message:
            'an error occured when sending verification mail pls try to re-login or contact support.',
        });
      }

      console.log();

      await otp.save();
      const token = await user.generateAuthToken();

      return res.send({ user, token });
    }

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send({
      error: { message: 'You have entered an invalid email or password' },
    });
  }
});

/**
 * @route   POST /auth/logout
 * @desc    Logout a user
 * @access  Private
 */
router.post('/logout', auth, async (req, res) => {
  const { user } = req;
  try {
    user.tokens = user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await user.save();
    res.send({ message: 'You have successfully logged out!' });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route   POST /auth/logoutAll
 * @desc    Logout a user from all devices
 * @access  Private
 */
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ message: 'You have successfully logged out!' });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
