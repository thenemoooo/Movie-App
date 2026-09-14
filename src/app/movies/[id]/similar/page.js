"use client";

import { useEffect, useState, use } from "react";
import { MovieCard } from "@/app/components/MovieCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SimilarMoviesPage({ params }) {
  const { id } = use(params);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=${page}`,
          options
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (err) {
        console.error("Төстэй кинонуудыг татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [id, page]);

  return (
    <div className="px-6 md:px-16 py-8 max-w-7xl mx-auto text-foreground min-h-screen">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
        More like this
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full aspect-[2/3] bg-accent/50 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {movies.slice(0, 10).map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <MovieCard
                title={movie.title}
                rating={
                  movie.vote_average ? movie.vote_average.toFixed(1) : "0"
                }
                poster={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                    : null
                }
              />
            </Link>
          ))}
        </div>
      )}

      {/* Хуудаслалт (Pagination) */}
      <div className="flex items-center justify-end gap-2 mt-10 text-sm">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground disabled:opacity-30 hover:text-foreground transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={() => setPage(1)}
          className={`w-8 h-8 rounded-md text-xs font-semibold transition border ${
            page === 1
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:bg-accent"
          }`}
        >
          1
        </button>

        <button
          onClick={() => setPage(2)}
          className={`w-8 h-8 rounded-md text-xs font-semibold transition border ${
            page === 2
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:bg-accent"
          }`}
        >
          2
        </button>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground disabled:opacity-30 hover:text-foreground transition"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}