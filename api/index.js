const app = require('../backend/server');

module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    res.on('finish', resolve);
    res.on('close', resolve);
    try {
      app(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: err.message });
      }
      resolve();
    }
  });
};
