import * as Yup from 'yup';
import { startOfHour, isBefore, parseISO } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Avatar from '../models/File';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Avatar,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { date, user_id, provider_id } = req.body;

    const providerIsValid = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!providerIsValid) {
      return res.json({ error: 'Invalid User/Provider' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are now permitted' });
    }

    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    await Appointment.create(req.body);

    return res.json({
      date,
      user_id,
      provider_id,
    });
  }
}

export default new AppointmentController();
