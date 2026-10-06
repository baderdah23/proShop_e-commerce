"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PauseIcon,
  PlayIcon,
} from "hugeicons-react";
import { heroSlides } from "../config/hero-slides";

const AUTOPLAY_DELAY = 5000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const pointerStart = useRef<number | null>(null);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
    setProgressKey((key) => key + 1);
  }, []);

  const goNext = useCallback(
    () => goToSlide(activeIndex + 1),
    [activeIndex, goToSlide],
  );
  const goPrevious = useCallback(
    () => goToSlide(activeIndex - 1),
    [activeIndex, goToSlide],
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(goNext, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused]);

  const activeSlide = heroSlides[activeIndex];

  return (
    <section
      className="hero-slider relative isolate min-h-[70vh] overflow-hidden bg-[#050914] text-white lg:min-h-[85vh]"
      aria-label="العروض المميزة"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setParallaxOffset({
          x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 12,
          y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
        });
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goPrevious();
        if (event.key === "ArrowRight") goNext();
      }}
      onTouchStart={(event) => {
        pointerStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (pointerStart.current === null) return;
        const distance =
          event.changedTouches[0]?.clientX - pointerStart.current;
        if (Math.abs(distance) > 48) (distance > 0 ? goPrevious : goNext)();
        pointerStart.current = null;
      }}
    >
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide absolute inset-0 transition-opacity duration-800 ease-in-out ${
            index === activeIndex
              ? "is-active z-10 opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className="hero-slide-image object-cover"
            style={
              {
                objectPosition: slide.position,
                "--parallax-x": `${index === activeIndex ? parallaxOffset.x : 0}px`,
                "--parallax-y": `${index === activeIndex ? parallaxOffset.y : 0}px`,
              } as CSSProperties
            }
          />
        </div>
      ))}

      <div className="hero-overlay absolute inset-0 z-20" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_72%_45%,rgba(70,150,255,0.18),transparent_34%)]" />

      <div className="relative z-30 mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-24 sm:px-8 lg:min-h-[85vh] lg:px-10">
        <div
          key={`${activeSlide.id}-${progressKey}`}
          className="me-auto max-w-2xl text-start"
        >
          <div className="hero-content-item mb-6 inline-flex items-center gap-2 rounded-full border border-[#6AABF0]/35 bg-white/8 px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#B9DCFF] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6AABF0] shadow-[0_0_14px_#6AABF0]" />
            {activeSlide.eyebrow}
          </div>
          <h1 className="hero-content-item text-4xl font-black leading-[1.12] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            {activeSlide.title}
            <span className="mt-2 block bg-linear-to-r from-[#A7D5FF] via-[#6AABF0] to-[#B69CFF] bg-clip-text text-transparent">
              {activeSlide.titleAccent}
            </span>
          </h1>
          <p className="hero-content-item mt-6 max-w-lg text-base leading-8 text-slate-200 sm:text-lg">
            {activeSlide.subtitle}
          </p>
          <div className="hero-content-item mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={activeSlide.href}
              className="hero-primary-button group inline-flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-extrabold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7D5FF]"
            >
              {activeSlide.cta}
              <ArrowRight01Icon
                size={18}
                className="rotate-180 transition-transform group-hover:-translate-x-1"
              />
            </Link>
            <span className="hero-badge rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-bold text-white/85 backdrop-blur-md">
              {activeSlide.badge}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-5 z-40 flex items-center gap-3 sm:left-8 lg:left-10">
        <div className="flex items-center gap-3" dir="ltr">
          <button
            type="button"
            onClick={goPrevious}
            className="hero-control"
            aria-label="العرض السابق"
          >
            <ArrowLeft01Icon size={19} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="hero-control"
            aria-label="العرض التالي"
          >
            <ArrowRight01Icon size={19} />
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            className="hero-control hidden sm:inline-flex"
            aria-label={isPaused ? "تشغيل العروض" : "إيقاف العروض"}
          >
            {isPaused ? <PlayIcon size={17} /> : <PauseIcon size={17} />}
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-7 right-5 z-40 flex flex-row-reverse items-center gap-2 sm:right-8 lg:right-10"
        role="tablist"
        aria-label="اختيار العرض"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`العرض ${index + 1}: ${slide.title}`}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${index === activeIndex ? "w-10 bg-[#6AABF0] shadow-[0_0_12px_#6AABF0]" : "w-2 bg-white/45 hover:bg-white/80"}`}
          />
        ))}
      </div>

      <div
        key={progressKey}
        className={`hero-progress absolute inset-x-0 bottom-0 z-50 h-1 bg-[#6AABF0] ${isPaused ? "paused" : ""}`}
      />
    </section>
  );
}
