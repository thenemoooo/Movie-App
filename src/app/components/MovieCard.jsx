import Image from "next/image";

export function MovieCard({ title, rating, poster }) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-muted shadow-md relative">
        {poster ? (
          <img
            src={poster}
            alt={title || "Movie poster"}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs font-semibold">{rating ? rating : "0"}/10</span>
        </div>
        <h3 className="text-sm font-medium truncate text-foreground group-hover:text-primary transition">
          {title}
        </h3>
      </div>
    </div>
  );
}