import AIService from '../services/AIService.js';

export const getPredictions = async (req, res, next) => {
  try {
    const result = await AIService.getPredictions(req.siteId);
    res.json(result);
  } catch (err) {
    console.error('[AIController getPredictions] ERROR:', err.message);
    next(err);
  }
};

export const getDemandForecast = async (req, res, next) => {
  try {
    const result = await AIService.getDemandForecast(req.siteId, req.params.productId);
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.json(result);
  } catch (err) {
    console.error('[AIController getDemandForecast] ERROR:', err.message);
    next(err);
  }
};

export const getAnomalies = async (req, res, next) => {
  try {
    const result = await AIService.getAnomalies(req.siteId);
    res.json(result);
  } catch (err) {
    console.error('[AIController getAnomalies] ERROR:', err.message);
    next(err);
  }
};

export const suggestCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Product name is required' });
    const category = await AIService.suggestCategory(req.siteId, name, description);
    res.json({ category });
  } catch (err) {
    console.error('[AIController suggestCategory] ERROR:', err.message);
    next(err);
  }
};