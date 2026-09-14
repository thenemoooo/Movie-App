const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/original";

export async function fetchFromTMDB(endpoint, params = "") {
  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US&${params}`
  );
  if (!res.ok) throw new Error("Failed to fetch data from TMDB");
  return res.json();
}

export async function getGenres() {
  return fetchFromTMDB("/genre/movie/list");
}

export async function searchMovies(query, page = 1) {
  return fetchFromTMDB("/search/movie", `query=${encodeURIComponent(query)}&page=${page}`);
}