"use client";

import { useState, useEffect } from "react";
import { Star, Play, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function HeroCarousel() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const res = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
          options
        );
        const data = await res.json();
        if (data.results) {
          setMovies(data.results.slice(0, 3));
        }
      } catch (err) {
        console.error("Кино татахад алдаа гарлаа:", err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0 || isModalOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies, isModalOpen]);

  const handleWatchTrailer = async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        options
      );
      const data = await res.json();
      const trailer =
        data.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        ) || data.results?.[0];

      if (trailer) {
        setTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert("Trailer олдсонгүй!");
      }
    } catch (err) {
      console.error("Trailer татахад алдаа гарлаа:", err);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden group rounded-none m-0 p-0">
      <img
        src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
        alt={currentMovie.title}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent flex items-center p-8 md:p-16">
        <div className="max-w-md text-white space-y-4">
          <p className="text-sm font-medium text-gray-300">Now Playing:</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {currentMovie.title}
          </h1>

          <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg">
            <Star className="w-5 h-5 fill-yellow-400" />
            <span>{currentMovie.vote_average?.toFixed(1)}</span>
            <span className="text-gray-400 text-sm font-normal">/10</span>
          </div>

          <p className="text-xs md:text-sm text-gray-200 line-clamp-4 leading-relaxed">
            {currentMovie.overview}
          </p>

          <button
            onClick={() => handleWatchTrailer(currentMovie.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-200 transition shadow-lg mt-2"
          >
            <Play className="w-4 h-4 fill-black" /> Watch Trailer
          </button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 hover:bg-white text-black shadow-md transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/70 hover:bg-white text-black shadow-md transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              currentIndex === idx ? "w-8 bg-white" : "w-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}