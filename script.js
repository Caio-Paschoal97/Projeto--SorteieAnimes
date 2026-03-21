const btn = document.getElementById("btnSortear");
const animeContainer = document.getElementById("anime");

btn.addEventListener("click", getAnime);

function showLoading() {
    animeContainer.innerHTML = `<p class="loading">Carregando anime...</p>`;
}

function showError(message) {
    animeContainer.innerHTML = `<p class="error">${message}</p>`;
}

function renderAnime(anime) {
    animeContainer.innerHTML = `
        <h3>${anime.title}</h3>
        <img src="${anime.images.jpg.image_url}" width="200">
        <p>${anime.synopsis || "Sem descrição disponível."}</p>
        <p><b>Episódios:</b> ${anime.episodes ?? "?"}</p>
        <p><b>Nota:</b> ${anime.score ?? "N/A"}</p>
    `;
}

// API
async function fetchAnime() {
    const response = await fetch("https://api.jikan.moe/v4/random/anime");

    if (!response.ok) {
        throw new Error("Erro na API");
    }

    const data = await response.json();
    return data.data;
}

// Controller
async function getAnime() {
    try {
        showLoading();

        const anime = await fetchAnime();

        renderAnime(anime);

    } catch (error) {
        showError("Erro ao buscar anime. Tente novamente.");
        console.error(error);
    }
}