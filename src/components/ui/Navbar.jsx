"use client";

import {
  Moon,
  Sun,
  Search,
  ChevronDown,
  ChevronRight,
  Film,
  Star,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const POSTER_THUMB_URL = "https://image.tmdb.org/t/p/w92";
const SEARCH_DEBOUNCE_MS = 350;
const MAX_DROPDOWN_RESULTS = 5;

export function NavigationBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const genreContainerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const fetchGenres = async () => {
      try {
        const res = await fetch("/api/genres");
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        genreContainerRef.current &&
        !genreContainerRef.current.contains(event.target)
      ) {
        setIsGenreOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setTotalResults(0);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(trimmed)}&page=1`
        );
        const data = await res.json();
        setSearchResults((data.results || []).slice(0, MAX_DROPDOWN_RESULTS));
        setTotalResults(data.total_results || 0);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const goToSearchResults = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearchOpen(false);
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  }, [query, router]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchResults();
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  if (!mounted) return null;

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-background sticky top-0 z-50 border-b border-border">
      <Link
        href="/"
        className="flex items-center gap-2 text-indigo-600 font-bold italic text-xl cursor-pointer"
      >
        <Film className="w-6 h-6" />
        <span>Movie Z</span>
      </Link>

      <div className="flex items-center gap-3 relative">
        <div ref={genreContainerRef} className="relative">
          <button
            onClick={() => {
              setIsGenreOpen((v) => !v);
              setIsSearchOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium hover:bg-muted/50 transition"
          >
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isGenreOpen ? "rotate-180" : ""
              }`}
            />
            <span>Genre</span>
          </button>

          {isGenreOpen && (
            <div className="absolute top-12 left-0 w-[550px] bg-card border border-border shadow-2xl rounded-2xl p-6 z-50 flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Genres
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See lists of movies by genre
                </p>
              </div>

              <hr className="border-border" />

              <div className="flex flex-wrap gap-2 max-h-[320px] overflow-y-auto pr-1">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genres?ids=${genre.id}`}
                    onClick={() => setIsGenreOpen(false)}
                    className="flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-full border border-border text-xs font-medium hover:bg-muted transition"
                  >
                    <span>{genre.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={searchContainerRef} className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsSearchOpen(true);
              setIsGenreOpen(false);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search.."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl outline-none bg-background focus:ring-1 focus:ring-indigo-500 transition"
          />

          {isSearchOpen && query.trim() && (
            <div className="absolute top-12 right-0 w-[420px] bg-card border border-border shadow-2xl rounded-2xl p-4 z-50 flex flex-col gap-1">
              {isSearching ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching…
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-3 py-2 border-b border-border last:border-b-0"
                    >
                      <div className="w-10 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {movie.poster_path ? (
                          <img
                            src={`${POSTER_THUMB_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">
                          {movie.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{movie.vote_average?.toFixed(1) ?? "—"}/10</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {movie.release_date
                            ? movie.release_date.slice(0, 4)
                            : "TBA"}
                        </span>
                      </div>
                      <Link
                        href={`/movies/${movie.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline flex-shrink-0"
                      >
                        See more <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                  <button
                    onClick={goToSearchResults}
                    className="text-left text-sm font-medium text-indigo-600 hover:underline pt-2"
                  >
                    See all results for &quot;{query.trim()}&quot;
                    {totalResults > MAX_DROPDOWN_RESULTS
                      ? ` (${totalResults})`
                      : ""}
                  </button>
                </>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 border rounded-xl hover:bg-muted/50 transition flex items-center justify-center"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>
    </nav>
  );
}
