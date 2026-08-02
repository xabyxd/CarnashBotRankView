const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3010;

// Configuration
const API_BASE_URL = 'https://xabyserver.ddns.net';
const API_ENDPOINT = '/lol/v4/rank.php';
const API_lang = 'en';

const summoners = [
    { name: 'xabyxd', tag: '6666', region: 'EUW' },
    { name: 'NUTS IN TRANCE', tag: '6X6', region: 'EUW' },
    { name: 'EXEDRA', tag: 'TEKK', region: 'EUW' },
    { name: 'EYES OF LIES', tag: '6XX', region: 'EUW' },
    { name: '진돗개', tag: '0415', region: 'KR' }
];

// Serve static files from public folder
app.use(express.static('public'));

// Endpoint to get data from remote API
app.get('/status', async (req, res) => {
    try {
        const summoner = summoners[1]; // Using array index X to select summoner
        const url = `${API_BASE_URL}${API_ENDPOINT}?name=${encodeURIComponent(summoner.name)}&tag=${encodeURIComponent(summoner.tag)}&r=${encodeURIComponent(summoner.region)}&lang=${API_lang}`;

        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        res.status(500).send('Error retrieving rank from remote API');
    }
});

// Serve index.html from root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
