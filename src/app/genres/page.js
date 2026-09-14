"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MovieCard } from "../components/MovieCard";
import Link from "next/link";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

function GenresFilterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawIds = searchParams.get("ids") || "";
  const selectedGenreIds = rawIds ? rawIds.split(",").map(Number) : [];

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjdkOGJlYmQwZjRmZjM0NWY2NTA1Yzk5ZTlkMDI4OSIsIm5iZiI6MTc0MjE3NTA4OS4zODksInN1YiI6IjY3ZDc3YjcxODVkMTM5MjFiNTAxNDE1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KxFMnZppBdHUSz_zB4p9A_gRD16I_R6OX1oiEe0LbE8",
    },
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
          options
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Жанр татахад алдаа гарлаа:", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenreIds.length === 0) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    const fetchGenreMovies = async () => {
      setLoading(true);
      try {
        const genreQuery = selectedGenreIds.join(",");
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreQuery}&language=en-US&page=${currentPage}`,
          options
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Шүүлтүүрээр кино татахад алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreMovies();
  }, [rawIds, currentPage]);

  const toggleGenre = (genreId) => {
    let newIds = [];
    if (selectedGenreIds.includes(genreId)) {
      newIds = selectedGenreIds.filter((id) => id !== genreId);
    } else {
      newIds = [...selectedGenreIds, genreId];
    }

    setCurrentPage(1);

    if (newIds.length === 0) {
      router.push("/genres");
    } else {
      const selectedNames = genres
        .filter((g) => newIds.includes(g.id))
        .map((g) => g.name)
        .join(",");
      router.push(
        `/genres?ids=${newIds.join(",")}&name=${encodeURIComponent(
          selectedNames
        )}`
      );
    }
  };

  const selectedGenreNames = genres
    .filter((g) => selectedGenreIds.includes(g.id))
    .map((g) => g.name)
    .join(", ");

  return (
    <div className="px-8 md:px-16 py-10 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8">Search filter</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-1">Genres</h2>
          <p className="text-xs text-muted-foreground mb-6">
            See lists of movies by genre
          </p>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenreIds.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-semibold transition ${
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:bg-accent text-foreground"
                  }`}
                >
                  {genre.name}
                  {isSelected ? (
                    <X className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedGenreIds.length > 0 ? (
            <h2 className="text-xl font-bold mb-6">
              {totalResults} titles in "{selectedGenreNames}"
            </h2>
          ) : (
            <h2 className="text-xl font-bold mb-6 text-muted-foreground">
              Select a genre to filter movies
            </h2>
          )}

          {loading ? (
            <div className="py-20 text-center text-muted-foreground">
              Loading...
            </div>
          ) : movies.length === 0 ? (
            <div className="border rounded-xl py-16 text-center text-sm font-medium text-muted-foreground bg-background shadow-xs">
              No results found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
              {movies.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <MovieCard
                    title={movie.title}
                    rating={
                      movie.vote_average
                        ? movie.vote_average.toFixed(1)
                        : "0"
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

          {totalResults > 0 && (
            <div className="flex items-center justify-end gap-2 mt-8 text-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="w-9 h-9 flex items-center justify-center border rounded-md font-semibold bg-background">
                {currentPage}
              </span>

              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                >
                  {currentPage + 1}
                </button>
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-foreground hover:bg-accent disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GenresPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <GenresFilterContent />
    </Suspense>
  );
}