const connection = require('../../database/connection');
const Yup = require('yup');

class ReplyController {
  async create(req, res) {
    const { reply_to, comments } = req.body;

    const schema = Yup.object().shape({
      reply_to: Yup.number().required().positive(),
      comments: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const [commentExist] = await connection('feed')
      .select('feed.*')
      .where('feed.id', '=', reply_to);

    if (!commentExist) {
      return res.status(400).json({ error: 'Comment does not exist' });
    }

    const comment = {
      reply_to,
      profile_id,
      comments,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [id] = await connection('reply').insert(comment, 'id');

    return res.json({
      id,
      ...comment,
    });
  }

  async list(req, res) {
    const reply_to = req.params.id;

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const list = await connection('reply')
      .select('reply.*')
      .where('reply.reply_to', '=', reply_to);

    const feed = list.map((row) => {
      return {
        id: row.id,
        reply_to: row.reply_to,
        profile_id: row.profile_id,
        comments: row.comments,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });
    return res.json(feed);
  }
}

module.exports = new ReplyController();
