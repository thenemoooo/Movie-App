import { NextResponse } from "next/server";
import { getMoviesByGenres } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genres = searchParams.get("genres");
  const page = Number(searchParams.get("page") ?? 1);

  if (!genres) {
    return NextResponse.json({ results: [], total_results: 0, total_pages: 0, page: 1 });
  }

  try {
    const data = await getMoviesByGenres(genres.split(","), page);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load movies" }, { status: 500 });
  }
}
