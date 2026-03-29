const btn = document.getElementById("btnSortear");
const animeContainer = document.getElementById("anime");
const statusLocalizacao = document.getElementById("status-localizacao");

// Inicialização ao carregar a página
window.addEventListener('load', () => {
    obterLocalizacaoNoMapa();
    registrarServiceWorker();
});

btn.addEventListener("click", getAnime);

// --- FUNÇÃO DO MAPA INTERATIVO ---
function obterLocalizacaoNoMapa() {
    if (!navigator.geolocation) {
        statusLocalizacao.innerText = "📍 Geolocalização não suportada.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            statusLocalizacao.innerHTML = `📍 Localização Ativa (Lat ${lat.toFixed(2)})`;

            // Criar o mapa usando Leaflet
            // [lat, lon] são as coordenadas, 13 é o zoom
            const map = L.map('map').setView([lat, lon], 13);

            // Adicionar as "telhas" do mapa (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Adicionar um marcador no local do usuário
            L.marker([lat, lon]).addTo(map)
                .bindPopup('Você está aqui maratonando! 🎌')
                .openPopup();
        },
        (error) => {
            console.error(error);
            statusLocalizacao.innerText = "📍 Localização: Permissão negada ou indisponível.";
            document.getElementById('map').style.display = 'none'; // Esconde o mapa se der erro
        }
    );
}

// --- LÓGICA DO SORTEIO DE ANIME ---
async function fetchAnime() {
    const response = await fetch("https://api.jikan.moe/v4/random/anime");
    if (!response.ok) throw new Error("Erro na API");
    const data = await response.json();
    return data.data;
}

async function getAnime() {
    try {
        btn.disabled = true;
        btn.innerText = "Sorteando...";
        animeContainer.innerHTML = `<p style="font-style:italic; opacity:0.7;">🏮 Buscando um anime...</p>`;

        const anime = await fetchAnime();

        setTimeout(() => {
            renderAnime(anime);
            btn.disabled = false;
            btn.innerText = "Sortear Anime 🎲";
        }, 500);
    } catch (error) {
        animeContainer.innerHTML = `<p style="color:var(--primary)">Erro na API. Tente novamente.</p>`;
        btn.disabled = false;
        btn.innerText = "Sortear Anime 🎲";
    }
}

function renderAnime(anime) {
    const synopsis = anime.synopsis ? anime.synopsis.substring(0, 250) + "..." : "Sem descrição disponível.";
    animeContainer.innerHTML = `
        <div class="anime-card">
            <h3>${anime.title}</h3>
            <img src="${anime.images.jpg.image_url}" class="anime-img">
            <div class="info-grid">
                <span class="badge">🎬 ${anime.episodes ?? "?"} eps</span>
                <span class="badge">⭐ ${anime.score ?? "N/A"}</span>
            </div>
            <div class="synopsis-container"><p>${synopsis}</p></div>
            <a href="${anime.url}" target="_blank" class="mal-link">Ver no MyAnimeList →</a>
        </div>
    `;
}

// --- PWA SERVICE WORKER ---
function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('Erro SW:', err));
    }
}