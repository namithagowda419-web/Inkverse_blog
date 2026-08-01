module.exports = (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'InkVerse Publishing Platform Server is running',
    timestamp: new Date().toISOString(),
  });
};
