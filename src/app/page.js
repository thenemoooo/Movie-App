"use client";

import HeroCarousel from "./components/HeroCarousel";
import { MovieCard } from "./components/MovieCard";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjdkOGJlYmQwZjRmZjM0NWY2NTA1Yzk5ZTlkMDI4OSIsIm5iZiI6MTc0MjE3NTA4OS4zODksInN1YiI6IjY3ZDc3YjcxODVkMTM5MjFiNTAxNDE1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KxFMnZppBdHUSz_zB4p9A_gRD16I_R6OX1oiEe0LbE8",
    },
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const resNow = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
          options
        );
        const dataNow = await resNow.json();
        setNowPlaying(dataNow.results?.slice(0, 5) || []);

        const resUpcoming = await fetch(
          "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
          options
        );
        const dataUpcoming = await resUpcoming.json();
        setUpcoming(dataUpcoming.results?.slice(0, 10) || []);

        const resPopular = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          options
        );
        const dataPopular = await resPopular.json();
        setPopular(dataPopular.results?.slice(0, 10) || []);

        const resTopRated = await fetch(
          "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
          options
        );
        const dataTopRated = await resTopRated.json();
        setTopRated(dataTopRated.results?.slice(0, 10) || []);
      } catch (err) {
        console.error("API татахад алдаа гарлаа:", err);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <HeroCarousel movies={nowPlaying} />

      <div className="px-10 py-8 flex flex-col gap-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Upcoming</h2>
            <Link
              href="/category/upcoming"
              className="flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {upcoming.map((movie) => (
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
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Popular</h2>
            <Link
              href="/category/popular"
              className="flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {popular.map((movie) => (
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
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Top Rated</h2>
            <Link
              href="/category/top_rated"
              className="flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              See more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {topRated.map((movie) => (
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
        </section>
      </div>
    </div>
  );
}