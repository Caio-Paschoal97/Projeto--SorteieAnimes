async function getAnime() {

    const response = await fetch("https://api.jikan.moe/v4/random/anime");
    const dados = await response.json();

    const anime = dados.data;

    document.getElementById("anime").innerHTML = `
        <h3>${anime.title}</h3>
        <img src="${anime.images.jpg.image_url}" width="200">
        <p>${anime.synopsis}</p>
        <p><b>Episódios:</b> ${anime.episodes}</p>
        <p><b>Nota:</b> ${anime.score}</p>
    `;
}