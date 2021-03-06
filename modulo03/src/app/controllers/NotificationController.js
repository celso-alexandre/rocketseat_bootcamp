import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const providerId = req.userId;
    const isProvider = await User.findOne({
      where: { id: providerId, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'Invalid User/Provider' });
    }

    const notifications = await Notification.find({
      user: providerId,
      read: false,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
