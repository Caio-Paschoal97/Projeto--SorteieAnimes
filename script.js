const btn = document.getElementById("btnSortear");
const animeContainer = document.getElementById("anime");

// Event Listener para o botão
btn.addEventListener("click", getAnime);

// Funções de Interface (UI)
function showLoading() {
    animeContainer.innerHTML = `
        <div class="loading">
            <p>🏮 Buscando um anime incrível para você...</p>
        </div>
    `;
}

function showError(message) {
    animeContainer.innerHTML = `
        <div class="error-container">
            <p class="error">❌ ${message}</p>
            <button onclick="getAnime()" style="width: auto; padding: 8px 15px; font-size: 0.8rem;">Tentar novamente</button>
        </div>
    `;
}

function renderAnime(anime) {
    // Limita a sinopse para não quebrar o layout se for muito grande
    const synopsis = anime.synopsis 
        ? anime.synopsis.length > 300 
            ? anime.synopsis.substring(0, 300) + "..." 
            : anime.synopsis
        : "Sem descrição disponível.";

    animeContainer.innerHTML = `
        <div class="anime-card">
            <h3>${anime.title}</h3>
            
            <img src="${anime.images.jpg.large_image_url || anime.images.jpg.image_url}" 
                 alt="${anime.title}" 
                 class="anime-img">
            
            <div class="info-grid">
                <span class="badge">🎬 ${anime.episodes ?? "?"} eps</span>
                <span class="badge">⭐ ${anime.score ?? "N/A"}</span>
                <span class="badge">📅 ${anime.year ?? "Vários"}</span>
            </div>

            <div class="synopsis-container">
                <p>${synopsis}</p>
            </div>
            
            <a href="${anime.url}" target="_blank" class="mal-link">
                Ver no MyAnimeList →
            </a>
        </div>
    `;
}

// Comunicação com a API (Service)
async function fetchAnime() {
    // A API Jikan pode falhar se houver muitas requisições seguidas (Rate Limit)
    const response = await fetch("https://api.jikan.moe/v4/random/anime");

    if (!response.ok) {
        throw new Error("Servidor ocupado. Tente em alguns segundos.");
    }

    const data = await response.json();
    return data.data;
}

// Controlador Principal (Controller)
async function getAnime() {
    try {
        // Desativa o botão temporariamente para evitar múltiplos cliques
        btn.disabled = true;
        btn.innerText = "Sorteando...";
        
        showLoading();

        const anime = await fetchAnime();

        // Pequeno delay para a animação de "loading" não piscar muito rápido
        setTimeout(() => {
            renderAnime(anime);
            btn.disabled = false;
            btn.innerText = "Sortear Anime 🎲";
        }, 500);

    } catch (error) {
        showError("Erro ao buscar anime. A API pode estar sobrecarregada.");
        console.error(error);
        btn.disabled = false;
        btn.innerText = "Sortear Anime 🎲";
    }
}