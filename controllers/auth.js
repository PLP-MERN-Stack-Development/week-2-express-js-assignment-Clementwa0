module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== '12345') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
