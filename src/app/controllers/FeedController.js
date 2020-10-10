const connection = require('../../database/connection');
const Yup = require('yup');

class FeedController {
  async create(req, res) {
    const { comments } = req.body;

    const schema = Yup.object().shape({
      comments: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const comment = {
      profile_id,
      comments,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [id] = await connection('feed').insert(comment, 'id');

    return res.json({
      id,
      ...comment,
    });
  }

  async list(req, res) {
    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const list = await connection('feed').select('feed.*');

    const feed = list.map((row) => {
      return {
        id: row.id,
        profile_id: row.profile_id,
        comments: row.comments,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });
    return res.json(feed);
  }

  async listFromConnection(req, res) {}
}

module.exports = new FeedController();
