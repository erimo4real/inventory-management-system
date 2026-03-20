export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  if (err.code === '23505') {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Foreign key constraint violation' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

export const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
  });
  
  next();
};
