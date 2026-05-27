import EntityImageService from '../services/EntityImageService.js';

export const uploadEntityImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { entityType, entityId } = req.params;
    const result = await EntityImageService.updateImage(entityType, entityId, req.file, req.siteId);

    res.json(result);
  } catch (err) {
    console.error(`[EntityImageController uploadEntityImage] ERROR:`, err.message);
    next(err);
  }
};

export const deleteEntityImage = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const result = await EntityImageService.deleteImage(entityType, entityId, req.siteId);

    res.json(result);
  } catch (err) {
    console.error(`[EntityImageController deleteEntityImage] ERROR:`, err.message);
    next(err);
  }
};