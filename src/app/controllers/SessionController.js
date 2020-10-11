const jwt = require('jsonwebtoken');
const Yup = require('yup');
const bcrypt = require('bcryptjs');
const connection = require('../../database/connection');
const authConfig = require('../../config/auth');

class SessionController {
  async create(req, res) {
    console.log('controller - session - create');

    const { email, password } = req.body.data;
    console.log(`[${email}][${password}]`);

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body.data))) {
      console.log('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [userExists] = await connection('users')
      .select('users.*')
      .where({ 'users.email': email });

    if (!userExists) {
      console.log('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    const checkPassword = (password) => {
      return bcrypt.compare(password, userExists.password_hash);
    };

    if (!(await checkPassword(password))) {
      console.log('Password does not match');
      return res.status(401).json({ error: 'Password does not match' });
    }

    return res.json({
      user: {
        id: userExists.id,
        user_name: userExists.user_name,
        email,
        phone: userExists.phone,
      },
      token: jwt.sign({ id: userExists.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
