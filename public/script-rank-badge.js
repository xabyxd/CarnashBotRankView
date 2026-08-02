function fetchStatus() {
    fetch('/status')
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.getElementById('status');
            let imageUrl = '';

            const tier = data.tier || 'UNRANKED';
            const rank = data.rank || '';
            const lp = data.lp || 0;
            const winrate = data.winrate || 0;
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
                    imageUrl = 'images/Iron.webp';
                    glowClass = 'glow-iron';
                    break;
                case 'BRONZE':
                    imageUrl = 'images/Bronze.webp';
                    glowClass = 'glow-bronze';
                    break;
                case 'SILVER':
                    imageUrl = 'images/Silver.webp';
                    glowClass = 'glow-silver';
                    break;
                case 'GOLD':
                    imageUrl = 'images/Gold.webp';
                    glowClass = 'glow-gold';
                    break;
                case 'PLATINUM':
                    imageUrl = 'images/Platinum.webp';
                    glowClass = 'glow-platinum';
                    break;
                case 'EMERALD':
                    imageUrl = 'images/Emerald.webp';
                    glowClass = 'glow-emerald';
                    break;
                case 'DIAMOND':
                    imageUrl = 'images/Diamond.webp';
                    glowClass = 'glow-diamond';
                    break;
                case 'MASTER':
                    imageUrl = 'images/Master.webp';
                    glowClass = 'glow-master';
                    break;
                case 'GRANDMASTER':
                    imageUrl = 'images/Grandmaster.webp';
                    glowClass = 'glow-grandmaster';
                    break;
                case 'CHALLENGER':
                    imageUrl = 'images/Challenger.webp';
                    glowClass = 'glow-challenger';
                    break;
                default:
                    imageUrl = 'images/Unranked.webp';
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
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = `<p>Error loading data</p>`;
        });
}

// Fetch status every minute
setInterval(fetchStatus, 60 * 1000);
fetchStatus(); // Initial load
