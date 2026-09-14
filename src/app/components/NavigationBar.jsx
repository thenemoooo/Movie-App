"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Film, ChevronDown, ChevronRight, Sun, Moon, Star, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

export default function NavigationBar() {
  const [genres, setGenres] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjdkOGJlYmQwZjRmZjM0NWY2NTA1Yzk5ZTlkMDI4OSIsIm5iZiI6MTc0MjE3NTA4OS4zODksInN1YiI6IjY3ZDc3YjcxODVkMTM5MjFiNTAxNDE1ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KxFMnZppBdHUSz_zB4p9A_gRD16I_R6OX1oiEe0LbE8",
    },
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchQuery
          )}&language=en-US&page=1`,
          options
        );
        const data = await res.json();
        setSearchResults(data.results?.slice(0, 5) || []);
        setIsSearchOpen(true);
      } catch (err) {
        console.error("Live хайлт хийхэд алдаа гарлаа:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border">
      <div className="flex h-16 items-center justify-between px-8 md:px-16 max-w-7xl mx-auto">
        
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-lg italic">
            <Film className="w-5 h-5 text-indigo-600" />
            Movie Z
          </Link>
        </div>

        <div className="flex items-center gap-3 justify-center">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium bg-background hover:bg-accent transition"
            >
              <ChevronDown className="w-3.5 h-3.5 text-foreground" />
              Genre
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[500px] md:w-[560px] p-6 bg-background border rounded-xl shadow-2xl z-50">
                <h2 className="text-xl font-bold text-foreground">Genres</h2>
                <p className="text-xs text-muted-foreground mt-1 mb-4 border-b pb-3">
                  See lists of movies by genre
                </p>

                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genres?ids=${genre.id}&name=${encodeURIComponent(genre.name)}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs font-medium hover:bg-accent hover:border-foreground transition text-foreground"
                    >
                      {genre.name}
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-64 md:w-96" ref={searchContainerRef}>
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              onKeyDown={handleSearchSubmit}
              className="w-full rounded-md border border-gray-300 bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
            />

            {isSearchOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-border">
                {searchLoading ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Хайж байна...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((movie) => (
                      <div
                        key={movie.id}
                        className="p-3 hover:bg-accent/50 transition flex items-center justify-between gap-3 group"
                      >
                        <Link
                          href={`/movies/${movie.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="w-10 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-muted-foreground">
                                No Pic
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <h4 className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>
                                {movie.vote_average
                                  ? movie.vote_average.toFixed(1)
                                  : "0"}
                                /10
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-0.5">
                              {movie.release_date
                                ? movie.release_date.split("-")[0]
                                : "N/A"}
                            </span>
                          </div>
                        </Link>

                        <Link
                          href={`/movies/${movie.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:underline flex-shrink-0"
                        >
                          See more <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}

                    <div className="p-3 text-xs font-medium hover:bg-accent/40 transition">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="block text-foreground"
                      >
                        See all results for "{searchQuery}"
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    Үр дүн олдсонгүй.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 border border-gray-300 rounded-md hover:bg-accent transition"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}