const Yup = require('yup');
const fetch = require('node-fetch');
const connection = require('../../database/connection');

class ProfilerController {
  async create(req, res) {
    console.log('controller - profile - create');

    const {
      age,
      profession,
      bio,
      story,
      technique,
      address,
      CEP,
      city,
      state,
      latitude,
      longitude,
    } = req.body;

    const schema = Yup.object().shape({
      age: Yup.number().positive(),
      profession: Yup.string(),
      bio: Yup.string(),
      story: Yup.string(),
      technique: Yup.number().positive(),
      CEP: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      address: Yup.string(),
      latitude: Yup.string(),
      longitude: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      console.log('Validation failed');
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [userProfileExists] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);

    if (userProfileExists) {
      console.log('User profile already exists');
      return res.status(400).json({ error: 'User profile already exists' });
    }

    const userProfile = {
      user_id: req.userId,
      age,
      profession,
      bio,
      story,
      technique,
      CEP,
      city,
      state,
      address,
      latitude,
      longitude,
    };

    const [id] = await connection('user_profile')
      .insert(userProfile, 'id')
      .where('user_profile.user_id', '=', req.userId);

    return res.json({
      id,
      ...userProfile,
    });
  }

  async listAll(req, res) {
    let query = await connection('user_profile')
      .select(
        'user_profile.*',
        'users.user_name as uUser_name',
        'users.email as uEmail',
        'users.phone as uPhone'
      )
      .join('users', 'users.id', 'user_profile.user_id');

    const userLists = query.map((row) => {
      return {
        id: row.id,
        user_id: req.userId,
        name: row.uUser_name,
        email: row.uEmail,
        phone: row.uPhone,
        age: row.age,
        profession: row.profession,
        bio: row.bio,
        story: row.story,
        technique: row.technique,
        Address: {
          address: row.address,
          city: row.city,
          state: row.state,
          CEP: row.CEP,
          latitude: row.latitude,
          longitude: row.longitude,
        },
      };
    });

    return res.json(userLists);
  }
}

module.exports = new ProfilerController();
