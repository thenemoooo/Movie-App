"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MovieCard } from "@/app/components/MovieCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || searchParams.get("query") || "";

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  
  const [selectedGenre, setSelectedGenre] = useState(null);

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
    if (!query) {
      setMovies([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query
          )}&language=en-US&page=${page}`,
          options
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalResults(data.total_results || 0);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (err) {
        console.error("Хайлт хийхэд алдаа гарлаа:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  const filteredMovies = selectedGenre
    ? movies.filter((movie) => movie.genre_ids?.includes(selectedGenre.id))
    : movies;

  const handleGenreClick = (genre) => {
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto text-foreground min-h-screen">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
        Search results
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-base font-bold">
                {selectedGenre
                  ? `${filteredMovies.length} results for "${query}" in ${selectedGenre.name}`
                  : `${totalResults} results for "${query}"`}
              </p>
              
              {selectedGenre && (
                <button
                  onClick={() => setSelectedGenre(null)}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition"
                >
                  Clear filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full aspect-[2/3] bg-accent/50 animate-pulse rounded-xl"
                  />
                ))}
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMovies.map((movie) => (
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
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : null
                      }
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-muted-foreground">
                "{query}" хайлтад {selectedGenre ? `"${selectedGenre.name}" жанрын` : ""} тохирох кино олдсонгүй.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center lg:justify-end gap-2 mt-12 text-sm">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground disabled:opacity-30 hover:text-foreground transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button className="w-8 h-8 rounded-md text-xs font-semibold bg-foreground text-background border border-foreground">
                {page}
              </button>

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-muted-foreground disabled:opacity-30 hover:text-foreground transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              Search by genre
            </h2>
            <p className="text-xs text-muted-foreground mt-1 mb-6">
              See lists of movies by genre
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const isSelected = selectedGenre?.id === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:bg-accent text-foreground"
                  }`}
                >
                  {genre.name}
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Уншиж байна...</div>}>
      <SearchContent />
    </Suspense>
  );
}