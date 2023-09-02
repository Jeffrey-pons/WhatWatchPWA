"use strict";

const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const result = document.getElementById("result");

let search = "";
let movies = [];

const fetchMovies = async () => {
  movies = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=e5c52a81a82f936a2fe9c53e7c89ce4d&query=${search}`
  ).then((res) => res.json());
  console.log(movies);
};

const moviesDisplay = async () => {
  await fetchMovies();

  movies.results.length = 12; 

  result.innerHTML = movies.results
    .map(
      (movie) =>
        `
    <li>
    <h2>${movie.original_title}</h2>
    <div class="card-content">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"></img>
      <div class="infos">
        <p>${movie.overview}</p>
        <p>Popularité : ${movie.popularity} ⭐</p>
      </div>
    </div>
  </li>
    `
    )
    .join("");
};

form.addEventListener("submit", (e) => {
  e.preventDefault(); // empeche le rechargement page html
  search = searchInput.value;

  moviesDisplay();
});