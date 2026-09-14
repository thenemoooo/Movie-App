import MovieCard from "./MovieCard";
import { fetchFromTMDB } from "@/lib/tmdb";

export default async function MovieList({ category, title }) {
  const data = await fetchFromTMDB(`/movie/${category}`);
  const movies = data.results.slice(0, 5);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            rating={movie.vote_average.toFixed(1)}
            poster={movie.poster_path}
          />
        ))}
      </div>
    </section>
  );
}