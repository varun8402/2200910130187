const express = require('express');

const app = express();
const mongoose = require('mongoose');
const urlshortRouter = require('./routes/urlshort.route');
const PORT = process.env.PORT || 3000;

app.use(express.json());





const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backendtest';
mongoose
	.connect(MONGO_URL)
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error', err));

app.use(urlshortRouter);




app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});


