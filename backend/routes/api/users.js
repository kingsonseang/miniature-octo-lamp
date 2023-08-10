const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../../config/auth');
const { simpleUpload } = require('../../utils/cloudinary');

/**
 * @route   POST /
 * @desc    404 page
 * @access  Public
 */
router.post('/', async (req, res) => {
  res.status(404).send({ message: "Don't try to post to the home page" });
});

/**
 * @route   GET /users
 * @desc    Get all users
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route   GET /users/me
 * @desc    Get logged in user details
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  const { user } = req;

  try {
    res.status(200).send({ user: user });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * @route   GET /users/:id
 * @desc    Get user by id
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return !user ? res.sendStatus(404) : res.send(user);
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * @route   PATCH /users/me/preference/*
 * @desc    Update logged in user preferences
 * @access  Private
 */
router.patch('/me/profle_prictue', auth, async (req, res) => {
  try {
    const { user, body } = req;
    
    user.profile_picture = body.image

    await user.save();

    res.send({ user: user });
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @route   PATCH /users/me/preference/*
 * @desc    Update logged in user preferences
 * @access  Private
 */
router.patch('/me/preference', auth, async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);
  const allowedUpdates = ['cuisine', 'excludeCuisine', 'diet', 'intolerances'];
  const isValidOperation = updates.every(update => {
    const isValid = allowedUpdates.includes(update);
    if (!isValid) validationErrors.push(update);
    return isValid;
  });

  if (!isValidOperation)
    return res.status(400).send({ error: `Invalid updates: ${validationErrors.join(',')}` });

  try {
    const { user } = req;
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    return res.send({ user: user });
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @route   PATCH /users/me
 * @desc    Update logged in user
 * @access  Private
 */
router.patch('/me', auth, async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'liked', 'cooked', 'views'];
  const isValidOperation = updates.every(update => {
    const isValid = allowedUpdates.includes(update);
    if (!isValid) validationErrors.push(update);
    return isValid;
  });

  if (!isValidOperation)
    return res.status(400).send({ error: `Invalid updates: ${validationErrors.join(',')}` });

  try {
    const { user } = req;
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    await user.save();
    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @route   PATCH /users/:id
 * @desc    Update user by id
 * @access  Private
 */
router.patch('/:id', auth, async (req, res) => {
  const validationErrors = [];
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'liked'];
  const isValidOperation = updates.every(update => {
    const isValid = allowedUpdates.includes(update);
    if (!isValid) validationErrors.push(update);
    return isValid;
  });

  if (!isValidOperation)
    return res.status(400).send({ error: `Invalid updates: ${validationErrors.join(',')}` });

  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) return res.sendStatus(404);
    updates.forEach(update => {
      user[update] = req.body[update];
    });

    // update user role if req is sent by admin or super admin
    if ((req.user.role === 'admin', req.user.role === 'superadmin')) {
      user['role'] === req.body['role'];
    }

    await user.save();

    return res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

/**
 * @route   DELETE /users/me
 * @desc    Delete logged in user
 * @access  Private
 */
router.delete('/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send({ message: 'User Deleted' });
  } catch (e) {
    res.sendStatus(400);
  }
});

/**
 * @route   DELETE /users/:id
 * @desc    Delete user by id
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.sendStatus(404);

    return res.send({ message: 'User Deleted' });
  } catch (e) {
    return res.sendStatus(400);
  }
});

/**
 * @route   Notification /users/set-push-token
 * @desc    Create user device public id
 * @access  Private
 */
router.post('/set-push-token', auth, async (req, res) => {
  const {
    body: { newPublicId },
    user,
    token,
  } = req;

  console.log(token, user, newPublicId);

  user.publicIds = user.publicIds.filter(publicId => {
    return publicId.relatedToken !== token;
  });

  user.publicIds.concat({ publicId: newPublicId, relatedToken: token });

  await user.save();

  res.status(201).send();
});

/**
 * @route   Recipe /recipe/like
 * @desc    Add liked recipe
 * @access  Private
 */
router.post('/recipe/like', auth, async (req, res) => {
  const {
    body: { recipe },
    user,
  } = req;

  const isLiked = await user.liked.includes(recipe);

  if (isLiked === true) {
    user.liked = user.liked.filter(likedRecipe => likedRecipe !== recipe);

    res.status(201).send({ isLiked: false });
  } else {
    user.liked.push(recipe);

    res.status(201).send({ isLiked: true });
  }

  await user.save();
});

/**
 * @route   Recipe /recipe/check-like
 * @desc    Check if recipe is liked already
 * @access  Private
 */
router.post('/recipe/check-like', auth, async (req, res) => {
  const {
    body: { targetId },
    user,
  } = req;

  const isLiked = await user.liked.some(item => item.id === targetId);;

  console.log(isLiked);

  return res.status(200).json({ isLiked });
});

/**
 * @route   Recipe /recipe/like
 * @desc    Add liked recipe
 * @access  Private
 */
router.post('/recipe/cook', auth, async (req, res) => {
  const {
    body: { recipe },
    user,
  } = req;


  user.cooked.push(recipe);

  res.status(201).send({ cooked: true });

  await user.save();
});

module.exports = router;
