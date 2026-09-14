"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Star, Play, ArrowRight, X } from "lucide-react";
import { MovieCard } from "@/app/components/MovieCard";

export default function MovieDetailPage({ params }) {
  const { id } = use(params);
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ director: "", writers: [], stars: [] });
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjdkOGJlYmQwZjRmZjM0NWY2NTA1Yzk5ZTlkMDI4OSIsIm5iZiI6MTc0MjE3NTA4OS4zODksInN1YiI6IjY3ZDc3YjcxODVkMTM5MjFiNTAxNDE1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KxFMnZppBdHUSz_zB4p9A_gRD16I_R6OX1oiEe0LbE8",
    },
  };

  useEffect(() => {
    if (!id) return;

    const fetchMovieData = async () => {
      setLoading(true);
      setMovie(null);
      setSimilarMovies([]);
      setTrailerKey(null);
      
      try {
        const resDetail = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          options
        );
        const dataDetail = await resDetail.json();
        setMovie(dataDetail);

        const resCredits = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
          options
        );
        const dataCredits = await resCredits.json();
        
        const director = dataCredits.crew?.find((c) => c.job === "Director")?.name || "N/A";
        const writers = dataCredits.crew
          ?.filter((c) => c.department === "Writing")
          ?.slice(0, 3)
          ?.map((w) => w.name) || [];
        const stars = dataCredits.cast?.slice(0, 3)?.map((a) => a.name) || [];

        setCredits({ director, writers, stars });

        const resVideos = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
          options
        );
        const dataVideos = await resVideos.json();
        const trailer = dataVideos.results?.find(
          (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        ) || dataVideos.results?.[0];

        if (trailer) {
          setTrailerKey(trailer.key);
        }

        const resSimilar = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
          options
        );
        const dataSimilar = await resSimilar.json();
        setSimilarMovies(dataSimilar.results?.slice(0, 5) || []);

      } catch (err) {
        console.error("Киноны мэдээлэл татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 animate-pulse space-y-6">
        <div className="h-8 bg-accent/50 rounded w-1/3" />
        <div className="h-96 bg-accent/50 rounded-2xl w-full" />
      </div>
    );
  }

  if (!movie) {
    return <div className="text-center py-20">Киноны мэдээлэл олдсонгүй.</div>;
  }

  return (
    <div key={id} className="max-w-7xl mx-auto px-6 md:px-12 py-8 text-foreground min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{movie.title}</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {movie.release_date} • {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "N/A"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          <div>
            <div className="text-sm font-bold">
              {movie.vote_average ? movie.vote_average.toFixed(1) : "0"}/10
            </div>
            <div className="text-[10px] text-muted-foreground">
              {movie.vote_count} votes
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">No Poster</div>
          )}
        </div>

        <div className="md:col-span-2 aspect-[16/9] md:aspect-auto rounded-xl overflow-hidden bg-black relative flex items-center justify-center group">
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-80"
            />
          ) : null}

          <button
            onClick={() => trailerKey ? setIsTrailerOpen(true) : alert("Энэ киноны трейлер одоогоор байхгүй байна.")}
            className="absolute flex items-center gap-2 px-5 py-2.5 bg-background/90 hover:bg-background backdrop-blur rounded-full text-xs md:text-sm font-semibold shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-foreground text-foreground" /> Play trailer
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {movie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 border border-border rounded-full text-xs font-medium"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-sm md:text-base text-foreground/90 leading-relaxed max-w-4xl">
          {movie.overview}
        </p>

        <div className="border-t border-b border-border divide-y divide-border text-sm">
          <div className="py-3 flex gap-4">
            <span className="font-bold w-24">Director</span>
            <span className="text-muted-foreground">{credits.director}</span>
          </div>
          {credits.writers.length > 0 && (
            <div className="py-3 flex gap-4">
              <span className="font-bold w-24">Writers</span>
              <span className="text-muted-foreground">{credits.writers.join(" • ")}</span>
            </div>
          )}
          {credits.stars.length > 0 && (
            <div className="py-3 flex gap-4">
              <span className="font-bold w-24">Stars</span>
              <span className="text-muted-foreground">{credits.stars.join(" • ")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">More like this</h2>
          <Link
            href={`/movies/${id}/similar`}
            className="text-xs font-medium flex items-center gap-1 hover:underline"
          >
            See more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {similarMovies.map((simMovie) => (
            <Link key={simMovie.id} href={`/movies/${simMovie.id}`}>
              <MovieCard
                title={simMovie.title}
                rating={simMovie.vote_average ? simMovie.vote_average.toFixed(1) : "0"}
                poster={
                  simMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${simMovie.poster_path}`
                    : null
                }
              />
            </Link>
          ))}
        </div>
      </div>

      {isTrailerOpen && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black rounded-full text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="YouTube trailer player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}