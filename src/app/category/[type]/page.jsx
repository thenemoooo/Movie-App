"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieCard } from "@/app/components/MovieCard";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const type = params.type;
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const titleMap = {
    upcoming: "Upcoming Movies",
    popular: "Popular Movies",
    top_rated: "Top Rated Movies",
  };

  useEffect(() => {
    if (!type) return;

    const fetchCategoryMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${page}`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjdkOGJlYmQwZjRmZjM0NWY2NTA1Yzk5ZTlkMDI4OSIsIm5iZiI6MTc0MjE3NTA4OS4zODksInN1YiI6IjY3ZDc3YjcxODVkMTM5MjFiNTAxNDE1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KxFMnZppBdHUSz_zB4p9A_gRD16I_R6OX1oiEe0LbE8",
            },
          }
        );
        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Ангилалын киног татахад алдаа гарлаа:", err);
      }
    };

    fetchCategoryMovies();
  }, [type, page]);

  return (
    <div className="px-10 py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{titleMap[type] || "Movies"}</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard
              title={movie.title}
              rating={movie.vote_average ? movie.vote_average.toFixed(1) : "0"}
              poster={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : null
              }
            />
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}