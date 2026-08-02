// Determines which endpoint to call based on the URL used to open the page:
//   /EUW/xabyxd-6X6   -> /api/rank/EUW/xabyxd-6X6
//   /preset/xaby      -> /api/rank/preset/xaby
// Returns null if the URL does not contain the expected parameters.
function resolveRankEndpoint() {
    const parts = window.location.pathname.split('/').filter(Boolean);

    if (parts.length === 2 && parts[0].toLowerCase() === 'preset') {
        return `/api/rank/preset/${encodeURIComponent(parts[1])}`;
    }

    if (parts.length === 2) {
        const [region, riotId] = parts;
        return `/api/rank/${encodeURIComponent(region)}/${encodeURIComponent(riotId)}`;
    }

    return null;
}

function fetchStatus() {
    const statusDiv = document.getElementById('status');
    const endpoint = resolveRankEndpoint();

    if (!endpoint) {
        statusDiv.innerHTML = `<p>Añade una región y summoner a la URL.<br>Ej: /EUW/xabyxd-6X6</p>`;
        return;
    }

    fetch(endpoint)
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'Error desconocido');
            }

            let imageUrl = '';

            const tier = data.tier || 'UNRANKED';
            const rank = data.rank || '';
            const lp = data.lp || 0;
            // The API now returns the win rate as text, including the % symbol (e.g., "53.13%").
            const winrate = (data.winrate ?? '0%').toString().replace('%', '');
            const summoner = data.summoner || 'Unknown';
            const region = data.region || 'Unknown';

            const tierUpper = tier.toUpperCase();
            let glowClass = 'glow-unranked'; // default

            /*
            Nota: Usar video WebM como badge
            Puedes poner un video .webm en lugar de un <img> para que tenga animación real:

            <video autoplay loop muted playsinline style="max-width:250px;">
                <source src="badges/diamond_aura.webm" type="video/webm">
            </video>
            */

            switch (tierUpper) {
                case 'IRON':
                    imageUrl = '/images/Iron.webp';
                    glowClass = 'glow-iron';
                    break;
                case 'BRONZE':
                    imageUrl = '/images/Bronze.webp';
                    glowClass = 'glow-bronze';
                    break;
                case 'SILVER':
                    imageUrl = '/images/Silver.webp';
                    glowClass = 'glow-silver';
                    break;
                case 'GOLD':
                    imageUrl = '/images/Gold.webp';
                    glowClass = 'glow-gold';
                    break;
                case 'PLATINUM':
                    imageUrl = '/images/Platinum.webp';
                    glowClass = 'glow-platinum';
                    break;
                case 'EMERALD':
                    imageUrl = '/images/Emerald.webp';
                    glowClass = 'glow-emerald';
                    break;
                case 'DIAMOND':
                    imageUrl = '/images/Diamond.webp';
                    glowClass = 'glow-diamond';
                    break;
                case 'MASTER':
                    imageUrl = '/images/Master.webp';
                    glowClass = 'glow-master';
                    break;
                case 'GRANDMASTER':
                    imageUrl = '/images/Grandmaster.webp';
                    glowClass = 'glow-grandmaster';
                    break;
                case 'CHALLENGER':
                    imageUrl = '/images/Challenger.webp';
                    glowClass = 'glow-challenger';
                    break;
                default:
                    imageUrl = '/images/Unranked.webp';
                    glowClass = 'glow-unranked';
            }

            const displayText = `${summoner} [${region}]<br>${tierUpper}${!['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tierUpper) && rank ? ' ' + rank : ''} - ${lp} LP<br>WR: ${winrate}%`;

            statusDiv.innerHTML = `
                <div id="rankbadge" class="rank-glow ${glowClass}">
                    <img src="${imageUrl}" alt="Rank Image">
                </div>
                <p>${displayText}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching status:', error);
            statusDiv.innerHTML = `<p>${error.message || 'Error loading data'}</p>`;
        });
}

// Fetch status every minute
setInterval(fetchStatus, 60 * 1000);
fetchStatus(); // Initial load