const express = require('express');
const QRCode = require('qrcode');

const router = express.Router();

// POST /api/qr
router.post('/', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const qrCodeDataURL = await QRCode.toDataURL(longUrl);
    res.json({ qrCodeUrl: qrCodeDataURL });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    res.status(500).json({ error: 'Failed to generate QR Code' });
  }
});

module.exports = router;
