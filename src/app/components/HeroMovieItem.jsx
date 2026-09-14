import { Star, Play } from "lucide-react";

export default function HeroMovieItem({ movie }) {
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.jpg";

  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-xl my-4">
      <img
        src={backdropUrl}
        alt={movie?.title || "Movie Backdrop"}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 md:p-16">
        <div className="max-w-md text-white space-y-3">
          <p className="text-xs uppercase tracking-wider text-gray-300">
            Now Playing:
          </p>
          <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>

          <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{movie?.vote_average?.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">/10</span>
          </div>

          <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
            {movie?.overview}
          </p>

          <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-md text-sm hover:bg-gray-200 transition mt-4">
            <Play className="w-4 h-4 fill-black" /> Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
}