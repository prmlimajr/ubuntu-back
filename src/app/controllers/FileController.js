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
    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const [avatarExists] = await connection('user_avatar')
      .select('user_avatar.*')
      .where('user_avatar.profile_id', '=', profile_id);
    const avatarPath = avatarExists.path;

    const fullPath = `${process.env.APP_URL}/files/${avatarPath}`;

    return res.json(fullPath);
  }
}

module.exports = new FileController();
