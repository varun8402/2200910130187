const mongoose = require('mongoose');

const ShortUrlSchema = new mongoose.Schema(
	{
		url: { type: String, required: true, trim: true },
		validity: { type: Number, required: true },
		shortcode: { type: String, required: true, unique: true, trim: true },
        createdAt: {type:Date},
        expiryTime : {type:Date},
        hits: { type: Number, default: 0 },
        clicks: [
            {
                ip: String,
                userAgent: String,
                referrer: String,
                timestamp: { type: Date, default: Date.now },
            },
        ],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);


