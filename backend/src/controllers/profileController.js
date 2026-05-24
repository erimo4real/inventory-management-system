import ProfileService from '../services/ProfileService.js';

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await ProfileService.updateAvatar(req.user.id, req.file);

    res.json(result);
  } catch (err) {
    console.error('[ProfileController updateAvatar] ERROR:', err.message);
    next(err);
  }
};
