const connection = require('../../database/connection');
const Yup = require('yup');

class ConnectionController {
  async create(req, res) {
    const schema = Yup.object().shape({
      user_id_connected_to: Yup.number().required().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { user_id_connected_to } = req.body;

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const [userToConnectExists] = await connection('users')
      .select('users.*')
      .where('users.id', '=', user_id_connected_to);

    if (!userToConnectExists) {
      return res.status(400).json({ error: "User doesn't exist" });
    }
    console.log(profile_id, user_id_connected_to);
    const [connectionExists] = await connection('user_connections')
      .select('user_connections.*')
      .where({ profile_id, user_id_connected_to });

    if (connectionExists) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    if (profile_id === user_id_connected_to) {
      return res.status(400).json({ error: 'Can not connect to yourself' });
    }

    const connect = {
      profile_id,
      user_id_connected_to,
    };

    const [revertProfile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', user_id_connected_to);
    const revertProfileId = revertProfile.id;

    const revert = {
      profile_id: revertProfileId,
      user_id_connected_to: profile_id,
    };

    const [id] = await connection('user_connections').insert(connect);
    await connection('user_connections').insert(revert);

    return res.json({
      id,
      ...connect,
    });
  }

  async list(req, res) {
    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const list = await connection('user_connections')
      .select('user_connections.*')
      .join('user_profile', 'user_connections.profile_id', 'user_profile.id');

    return res.json(list);
  }
}

module.exports = new ConnectionController();
