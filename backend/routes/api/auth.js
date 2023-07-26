const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Otp = require('../../models/Otp');
const auth = require('../../config/auth');
const sendOtp = require('../../utils/sendOtp');
const generateOTP = require('../../utils/genetateOtp');
const sendLoginEmail = require('../../utils/sendLoginEmail');

/**
 * @route   POST /auth/register
 * @desc    register a user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstname, lastname, username, phone } = req.body;

    const email_exist = await User.findOne({ email: email });
    const phone_exist = await User.findOne({ phone: phone });

    if (email_exist) {
      return res.status(409).send({
        error: true,
        message: 'You have entered an email associated with another account.',
      });
    }

    if (phone_exist) {
      return res.status(409).send({
        error: true,
        message: 'You have entered a phone number associated with another account.',
      });
    }

    const user = new User({
      email: email,
      password: password,
      name: { first: firstname, last: lastname },
      username: username,
      phone: phone,
    });

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
    const { email, password, device } = req.body;

    console.log(email, password);

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res.send({
        user: false,
        error: true,
        message: 'Email not associated with a Black Bento account!',
      });
    }

    if (user?.emailVerified === false) {
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
          emailVerified: false,
          message:
            'an error occured when sending verification mail pls try to re-login or contact support.',
        });
      }

      await otp.save();

      return res.status(200).send({
        user: true,
        error: false,
        emailVerified: false,
        message: "An email has been sent to you, Please verify you email to continue"
      });
    }

    const sendUserLoginEmail = await sendLoginEmail(user, device);

    const token = await user.generateAuthToken();

    if (!sendUserLoginEmail?.sent) {
      return res.send({
        user: true,
        error: true,
        token: token,
        message: 'An error occured when sending login mail.',
      });
    }

    res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);

    res.status(400).send({
      error: true,
      message: 'You have entered an invalid email or password',
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
    user.publicIds = user.publicIds.filter(publicId => {
      return publicId.relatedToken !== req.token;
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
    req.user.publicIds = [];
    await req.user.save();
    res.send({ message: 'You have successfully logged out!' });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route   POST /auth/reset/otp
 * @desc    Send Otp to reset password
 * @access  Public
 */
router.post('/reset/otp', async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(404).send({ error: true, message: 'Email not associated with an account!' });
  }

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
        'an error occured when sending verification mail pls again later or contact support.',
    });
  }

  await otp.save();
  return res.status(200).send({ error: false, message: 'Otp sent successfully' });
});

/**
 * @route   POST /auth/reset
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset', async (req, res) => {
  const { email, newPassword, digits } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(404).send({ error: true, message: 'Email not associated with an account!' });
  }

  // find the current user otp
  const currentOtp = await Otp.findByCredentials(user._id);

  if (!currentOtp) {
    return res
      .status(404)
      .send({ error: true, match: false, message: 'OTP not valid or expired!' });
  }

  if (currentOtp.code !== digits) {
    return res.status(404).send({ error: true, match: false, message: 'Otp not Valid!' });
  }

  user.password = newPassword; // Will trigger pre('save') middleware to hash the password
  user.tokens = []; // Delete all tokens
  await user.save();

  const token = await user.generateAuthToken();

  await currentOtp.Invalidate();

  return res.status(200).send({
    error: false,
    token: token,
    message: 'Password reset successful, you have been logged out on all other devices!',
  });
});

/**
 * @route   POST /auth/verify
 * @desc    Verify user
 * @access  Public
 */
router.post('/verify', async (req, res) => {
  const { email, digits } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(404).send({ error: true, message: 'Email not associated with an account!' });
  }

  // find the current user otp
  const currentOtp = await Otp.findByCredentials(user._id);

  if (!currentOtp) {
    return res.status(404).send({ error: true, message: 'OTP not valid or expired!' });
  }

  if (currentOtp.code !== digits) {
    return res.status(404).send({ error: true, match: false, message: 'Otp not Valid!' });
  }

  user.emailVerified = true;
  await user.save()

  const token = await user.generateAuthToken();

  return res.status(200).send({
    error: false,
    token: token
  });
});

/**
 * @route   POST /auth/verify/new
 * @desc    Send another otp
 * @access  Public
 */
router.post('/verify/new', async (req, res) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(404).send({ error: true, message: 'Email not associated with an account!' });
  }

  // delete all the current user otp
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

  await otp.save();

  return res.status(200).send({
    error: false,
    message: 'New Otp Sent Successfully!',
  });
});

module.exports = router;
