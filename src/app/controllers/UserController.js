const Yup = require('yup');
const bcrypt = require('bcryptjs');

const connection = require('../../database/connection');

class UserController {
  async create(req, res) {
    console.log('controller - user - create');

    const { name, email, phone, password, confirmPassword } = req.body;

    console.log(
      `[${name}][${email}][${phone}][${password}][${confirmPassword}]`
    );

    const Schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      password: Yup.string().required().min(6),
      confirmPassword: Yup.string().required(),
    });

    if (!(await Schema.isValid(req.body))) {
      console.log('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    if (password !== confirmPassword) {
      console.log('Password doesnt match:', password, confirmPassword);
      return res.status(400).json({ error: "Password doesn't match" });
    }

    const [userExists] = await connection('users')
      .select('users.*')
      .where('users.email', '=', email);

    if (userExists) {
      console.log('user already exists:', userExists);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      user_name: name,
      email,
      password_hash: hashedPassword,
      phone,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [id] = await connection('users').insert(user, 'id');

    return res.json({
      id,
      ...user,
    });
  }
}

module.exports = new UserController();
