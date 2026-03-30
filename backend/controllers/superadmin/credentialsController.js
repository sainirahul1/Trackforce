const User = require('../../models/tenant/User');
const bcrypt = require('bcryptjs');

const updateCredentials = async (req, res) => {
  try {
    const { uid, email, currentPassword, newPassword } = req.body;

    // Based on requirement: Identify user using: Superadmin UID (SYS-ROOT-001)
    if (uid !== 'SYS-ROOT-001') {
      return res.status(403).json({ message: 'Invalid Superadmin UID' });
    }

    // Also must be protected by admin middleware, so req.user is superadmin
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 'superadmin') {
      return res.status(404).json({ message: 'Superadmin not found' });
    }

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    let isModified = false;

    // Validate and update email
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      if (user.email !== email) {
        // check if email is already taken by someone else
        const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
        if (emailExists) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
        user.email = email;
        isModified = true;
      }
    }

    // Validate and update password
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be minimum 8 characters' });
      }
      user.password = newPassword; // The pre-save hook in User model will hash it
      isModified = true;
    }

    if (isModified) {
      await user.save();
      return res.status(200).json({ message: 'Credentials updated successfully' });
    } else {
      return res.status(200).json({ message: 'No changes detected' });
    }

  } catch (error) {
    console.error('Update credentials error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  updateCredentials
};
