const Yup = require('yup');
const connection = require('../../database/connection');

class InterestController {
  async create(req, res) {
    const schema = Yup.object().shape({
      interest_description: Yup.string().required(),
    });

    const { interest_description } = req.body;

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    const [interestExist] = await connection('user_interest')
      .select('user_interest.*')
      .where({
        'user_interest.interest_description': interest_description,
        'user_interest.profile_id': profile_id,
      });

    if (interestExist) {
      return res.status(400).json({ error: 'Interest already registered' });
    }

    const interest = {
      profile_id,
      interest_description,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [id] = await connection('user_interest').insert(interest);

    return res.json({
      id,
      ...interest,
    });
  }

  async list(req, res) {
    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', req.userId);
    const profile_id = profile.id;

    let query = await connection('user_interest')
      .select('user_interest.*')
      .where('user_interest.profile_id', '=', profile_id);

    let list = query.map((row) => {
      return {
        id: row.id,
        profile_id: row.profile_id,
        interest_description: row.interest_description,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return res.json(list);
  }

  async listAnotherUser(req, res) {
    const { id } = req.params;

    const [profile] = await connection('user_profile')
      .select('user_profile.*')
      .where('user_profile.user_id', '=', id);
    const profile_id = profile.id;

    let query = await connection('user_interest')
      .select('user_interest.*')
      .where('user_interest.profile_id', '=', profile_id);

    let list = query.map((row) => {
      return {
        id: row.id,
        profile_id: row.profile_id,
        interest_description: row.interest_description,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });

    return res.json(list);
  }
}

module.exports = new InterestController();
