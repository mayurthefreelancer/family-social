"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { PhotoItem } from "./PhotoMosaicGrid";

interface PhotoLightboxModalProps {
  photos: PhotoItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}


export function PhotoLightboxModal({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
}: PhotoLightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastTapRef = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Sync index if initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  // Lock body scroll and track mount for portal
  useEffect(() => {
    setMounted(true);
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setCurrentIndex((idx) => idx - 1);
      setIsZoomed(false);
    }
  }, [hasPrev]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex((idx) => idx + 1);
      setIsZoomed(false);
    }
  }, [hasNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch Swipe Handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance && hasNext) {
      handleNext();
    } else if (distance < -minSwipeDistance && hasPrev) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }

  // Double tap to zoom handler
  function handleDoubleTap() {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setIsZoomed((prev) => !prev);
    }
    lastTapRef.current = now;
  }

  if (!isOpen || !mounted || typeof document === "undefined" || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex] || photos[0];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo Lightbox"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
    >
      {/* Top Action Bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 text-white z-10">
        <div className="flex items-center gap-2">
          {/* Photo indicator */}
          <span className="text-sm sm:text-base font-semibold tracking-wide font-mono px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
            {currentIndex + 1} / {photos.length}
          </span>
          {photos.length > 1 && (
            <span className="text-xs text-white/60 hidden sm:inline">
              ({currentIndex + 1} of {photos.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom toggle button */}
          <button
            type="button"
            onClick={() => setIsZoomed((prev) => !prev)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            title={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? (
              <ZoomOut className="w-5 h-5" />
            ) : (
              <ZoomIn className="w-5 h-5" />
            )}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Image Stage */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        <div
          className={`relative max-w-full max-h-full transition-transform duration-300 ease-out ${
            isZoomed ? "scale-150 sm:scale-175 cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || `Family photo ${currentIndex + 1}`}
            className="max-h-[82vh] max-w-[95vw] object-contain rounded-lg shadow-2xl mx-auto"
            draggable={false}
          />
        </div>

        {/* Desktop Previous Button */}
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center border border-white/10 transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Desktop Next Button */}
        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center border border-white/10 transition-all hover:scale-110 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Footer Caption / Hint */}
      <footer className="px-4 py-3 text-center text-white/70 text-xs sm:text-sm z-10 flex flex-col items-center gap-1">
        {currentPhoto.caption && (
          <p className="max-w-xl text-white font-medium">
            {currentPhoto.caption}
          </p>
        )}
        <span className="text-[11px] text-white/40">
          Double-tap or swipe to explore • Press Esc to close
        </span>
      </footer>
    </div>,
    document.body
  );
}
