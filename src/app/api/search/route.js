import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("query") ?? "").trim();
  const page = Number(searchParams.get("page") ?? 1);

  if (!query) {
    return NextResponse.json({ results: [], total_results: 0, total_pages: 0, page: 1 });
  }

  try {
    const data = await searchMovies(query, page);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
