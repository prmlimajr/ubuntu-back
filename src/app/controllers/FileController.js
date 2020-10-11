const connection = require('../../database/connection');

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = {
      avatar_name: name,
      profile_id: req.userId,
      path,
    };

    const [insertedFile] = await connection('user_avatar').insert(file);

    const updateUser = await connection('user_profile')
      .update({ avatar_id: insertedFile })
      .where({ id: req.userId });

    return res.json(insertedFile);
  }

  async list(req, res) {
    const { id } = req.params;

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', id);

    if (!profile) {
      return res.status(400).json({ error: 'profile doesnot exist' });
    }
    const profile_id = profile.id;

    const [avatarExists] = await connection('user_avatar')
      .select('user_avatar.*')
      .where('user_avatar.profile_id', '=', profile_id);

    if (!avatarExists) {
      return res.status(400).json({ error: 'Avatar doesnot exist' });
    }

    const avatarPath = avatarExists.path;

    const fullPath = `${process.env.APP_URL}/files/${avatarPath}`;

    return res.json({
      avatar: fullPath,
    });
  }
}

module.exports = new FileController();
