const User = require("../models/User");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // create user to the database
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};
