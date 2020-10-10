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
}

module.exports = new FileController();
