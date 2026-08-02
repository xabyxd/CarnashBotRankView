const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3010;

// Configuration
const API_BASE_URL = 'https://xabyserver.ddns.net';
const API_ENDPOINT = '/lol/v4/rank.php';
const API_LANG = 'en';

// Array of valid regions for the API endpoint
const VALID_REGIONS = ['EUW', 'EUNE', 'NA', 'KR', 'JP', 'BR', 'LAN', 'LAS', 'OCE', 'TR', 'RU'];

// Array of summoners to display (old format)
const summoners = [
    { name: 'xabyxd', tag: '6666', region: 'EUW' },
    { name: 'NUTS IN TRANCE', tag: '6X6', region: 'EUW' },
    { name: 'EXEDRA', tag: 'TEKK', region: 'EUW' },
    { name: 'EYES OF LIES', tag: '6XX', region: 'EUW' },
    { name: '진돗개', tag: '0415', region: 'KR' }
];

// Express memory cache for summoner data
const CACHE_TTL_MS = 30 * 1000; // 1 minute
const cache = new Map();

// The Riot tagLine is always alphanumeric (never contains hyphens), so
// we can safely split at the LAST hyphen, even if the summoner name
// contains hyphens (e.g., "IS-NUTS-6X6" -> name="IS-NUTS", tag="6X6").
function parseRiotId(raw) {
    const decoded = decodeURIComponent(raw);
    const sepIndex = decoded.lastIndexOf('-');
    if (sepIndex <= 0 || sepIndex === decoded.length - 1) return null;
    return {
        name: decoded.slice(0, sepIndex),
        tag: decoded.slice(sepIndex + 1)
    };
}

async function fetchRank(region, name, tag) {
    const cacheKey = `${region}:${name}:${tag}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
        return cached.data;
    }

    const url = `${API_BASE_URL}${API_ENDPOINT}?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}&r=${encodeURIComponent(region)}&lang=${API_LANG}`;
    const response = await axios.get(url, { timeout: 8000 });

    cache.set(cacheKey, { data: response.data, time: Date.now() });
    return response.data;
}

// Serve static files from public folder
app.use(express.static('public'));

// API for the presets: /api/rank/preset/xaby
// (goes BEFORE the generic route below: Express tests routes in the
// order they are registered, and "preset" would also match as :region)
app.get('/api/rank/preset/:key', async (req, res) => {
    const preset = presets[req.params.key.toLowerCase()];
    if (!preset) {
        return res.status(404).json({ error: `Preset desconocido: ${req.params.key}` });
    }

    try {
        const data = await fetchRank(preset.region, preset.name, preset.tag);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        res.status(500).json({ error: 'No se pudo obtener el rango desde la API remota' });
    }
});

// API: /api/rank/EUW/xabyxd-6X6
app.get('/api/rank/:region/:riotId', async (req, res) => {
    const region = req.params.region.toUpperCase();
    if (!VALID_REGIONS.includes(region)) {
        return res.status(400).json({ error: `Región no soportada: ${region}` });
    }

    const parsed = parseRiotId(req.params.riotId);
    if (!parsed) {
        return res.status(400).json({ error: 'Formato inválido. Usa nombre-tag, ej: xabyxd-6X6' });
    }

    try {
        const data = await fetchRank(region, parsed.name, parsed.tag);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        const status = error.response?.status && error.response.status < 500 ? error.response.status : 500;
        res.status(status).json({ error: 'No se pudo obtener el rango desde la API remota' });
    }
});

// Overlay: /EUW/xabyxd-6X6  -> serves the same index.html; el front-end
// read the región/riotId from the same URL to ask for the correct data.
app.get('/preset/:key', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:region/:riotId', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
