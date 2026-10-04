"use client";

import React from "react";

export interface PhotoItem {
  id: string;
  url: string;
  caption?: string | null;
}

interface PhotoMosaicGridProps {
  photos: PhotoItem[];
  onPhotoClick?: (index: number) => void;
}

export function PhotoMosaicGrid({ photos, onPhotoClick }: PhotoMosaicGridProps) {
  if (!photos || photos.length === 0) return null;

  const total = photos.length;

  // 1 Photo: Hero layout
  if (total === 1) {
    return (
      <div className="w-full max-h-[460px] overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
        <button
          type="button"
          onClick={() => onPhotoClick?.(0)}
          className="w-full h-full block focus:outline-none cursor-pointer group text-left"
        >
          <img
            src={photos[0].url}
            alt={photos[0].caption || "Family moment"}
            className="w-full h-full max-h-[460px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
        </button>
      </div>
    );
  }

  // 2 Photos: 50/50 Split
  if (total === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 h-64 sm:h-72 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
        {photos.map((photo, idx) => (
          <button
            key={photo.id || idx}
            type="button"
            onClick={() => onPhotoClick?.(idx)}
            className="relative w-full h-full overflow-hidden focus:outline-none cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={photo.caption || `Family moment ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    );
  }

  // 3 Photos: 1 Hero left, 2 Stacked right
  if (total === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 h-72 sm:h-80 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
        {/* Left Hero */}
        <button
          type="button"
          onClick={() => onPhotoClick?.(0)}
          className="relative w-full h-full overflow-hidden focus:outline-none cursor-pointer group"
        >
          <img
            src={photos[0].url}
            alt={photos[0].caption || "Family moment 1"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </button>

        {/* Right Stacked Column */}
        <div className="grid grid-rows-2 gap-2 h-full">
          {photos.slice(1, 3).map((photo, idx) => (
            <button
              key={photo.id || idx + 1}
              type="button"
              onClick={() => onPhotoClick?.(idx + 1)}
              className="relative w-full h-full overflow-hidden focus:outline-none cursor-pointer group"
            >
              <img
                src={photo.url}
                alt={photo.caption || `Family moment ${idx + 2}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 4+ Photos: 2x2 Grid with +N Badge on 4th cell if >4
  const displayPhotos = photos.slice(0, 4);
  const remainingCount = total - 3;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-72 sm:h-80 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850">
      {displayPhotos.map((photo, idx) => {
        const isLastCellWithOverflow = idx === 3 && total > 4;

        return (
          <button
            key={photo.id || idx}
            type="button"
            onClick={() => onPhotoClick?.(idx)}
            className="relative w-full h-full overflow-hidden focus:outline-none cursor-pointer group"
          >
            <img
              src={photo.url}
              alt={photo.caption || `Family moment ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {isLastCellWithOverflow && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-colors group-hover:bg-black/70">
                <span className="text-xl sm:text-2xl font-bold tracking-tight">
                  +{remainingCount}
                </span>
                <span className="text-xs font-medium tracking-wide">
                  more
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
