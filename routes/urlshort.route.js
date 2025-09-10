const express = require('express');
const router = express.Router();
const ShortUrl = require('../models/ShortUrl');

router.post('/shorturls', async (req, res) => {
	const { url, validity, shortcode } = req.body;

	if (!url || !validity || !shortcode) {
		return res.status(400).send({ error: 'Enter all details' });
	}

	try {
		const now = new Date();
		const validityMs = Number(validity);
		const expiryTime = new Date(now.getTime() + validityMs);
		const shortcodecheck = await ShortUrl.findOne({ shortcode });
		if (shortcodecheck) {
			return res.status(409).send({ error: 'shortcode already exists' });
		}
		const doc = await ShortUrl.create({ url, validity: validityMs, shortcode, createdAt: now, expiryTime });
		if (!doc) {
			return res.status(500).send({ error: 'Some error occurred' });
		}
		const host = req.get('host');
		const shortUrl = `${host}/${doc.shortcode}`;
        const expiry = expiryTime
		return res.status(201).send({ shortUrl , expiry});  
	} catch (err) {
		return res.status(400).send({ error: err.message || 'Failed to create' });
	}
});

router.get('/shorturls/:code' , async(req,res)=>{
	try{
		const { code } = req.params;
		const click = {
			ip: req.ip,
			userAgent: req.get('user-agent') || '',
			referrer: req.get('referer') || req.get('referrer') || '',
			timestamp: new Date(),
		};
		const update = { $inc: { hits: 1 }, $push: { clicks: click } };
		const options = { new: true };
		const doc = await ShortUrl.findOneAndUpdate({ shortcode: code }, update, options);
		if (!doc) return res.status(404).send({ error: 'not found' });
		return res.status(200).send({ hits: doc.hits, clicks: doc.clicks });
	} catch (err) {
		return res.status(500).send({ error: 'Internal server error' });
	}
});

router.get('/:code', async (req, res) => {
	try {
		const { code } = req.params;
		const click = {
			ip: req.ip,
			userAgent: req.get('user-agent') || '',
			referrer: req.get('referer') || req.get('referrer') || '',
			timestamp: new Date(),
		};
		const update = { $inc: { hits: 1 }, $push: { clicks: click } };
		const options = { new: true };
		const doc = await ShortUrl.findOneAndUpdate({ shortcode: code }, update, options);
		if (!doc) return res.status(404).send({ error: 'not found' });
		if (doc.expiryTime && doc.expiryTime < new Date()) {
			return res.status(410).send({ error: 'expired' });
		}
		return res.redirect(doc.url);
	} catch (err) {
		return res.status(500).send({ error: 'Internal server error' });
	}
});

module.exports = router;
