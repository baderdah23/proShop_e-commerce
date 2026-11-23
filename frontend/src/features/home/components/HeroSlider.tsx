"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Ticket01Icon,
} from "hugeicons-react";
import { heroSlides } from "../config/hero-slides";

const AUTOPLAY_DELAY = 6000;

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
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
    <section className="shell pt-5 sm:pt-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <div
          className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_18px_50px_-32px_rgba(10,11,10,0.28)] lg:col-span-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="font-latin text-[10px] font-bold tracking-[0.22em] text-muted">
                PROSTORE / SELECTED HARDWARE
              </span>
              <span className="size-1.5 rounded-full bg-signal" />
            </div>
            <span className="font-latin text-[11px] font-bold tracking-[0.16em] text-ink">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="mx-1.5 text-line">/</span>
              {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="order-2 flex flex-col justify-between px-5 pb-8 pt-8 sm:px-8 sm:pt-10 lg:order-1 lg:min-h-[430px] lg:px-10 lg:py-12">
              <div>
                <div className="mb-7 flex items-center gap-2.5">
                  <span className="grid size-6 place-items-center rounded-md bg-signal">
                    <span className="size-1.5 rounded-full bg-ink" />
                  </span>
                  <span className="text-[11px] font-bold text-ink/70">
                    {activeSlide.eyebrow}
                  </span>
                </div>

                <h1 className="max-w-xl text-[34px] font-black leading-[1.1] tracking-[-0.045em] text-ink sm:text-[46px] lg:text-[50px]">
                  {activeSlide.title}
                  <span className="mt-2 block text-muted">{activeSlide.titleAccent}</span>
                </h1>

                <div className="mt-7 flex items-center gap-3">
                  <span className="h-[3px] w-12 rounded-full bg-ink" />
                  <span className="font-latin text-[10px] font-bold tracking-[0.18em] text-muted">
                    FEATURED / {activeSlide.id.toUpperCase()}
                  </span>
                </div>

                <p className="mt-6 max-w-md text-[13px] leading-7 text-muted">
                  {activeSlide.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href={activeSlide.href}
                    className="liquid-glass-btn inline-flex h-12 items-center gap-2.5 rounded-xl px-6 text-[13px] font-bold"
                  >
                    {activeSlide.cta}
                    <ArrowRight01Icon size={16} className="rotate-180" />
                  </Link>
                  <div className="border-s-2 border-signal ps-3.5">
                    <span className="block text-[10px] font-semibold text-muted">السعر / العرض</span>
                    <span className="font-latin mt-0.5 block text-[13px] font-black text-ink">
                      {activeSlide.priceNote}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-3 border-t border-line pt-5">
                {[
                  { label: "الحالة", value: "متوفر" },
                  { label: "الضمان", value: "36 شهراً" },
                  { label: "التوصيل", value: "مجاني" },
                ].map((cell) => (
                  <div key={cell.label} className="px-3 first:ps-0 last:pe-0">
                    <span className="block text-[10px] text-muted">{cell.label}</span>
                    <span className="mt-1 block text-[12px] font-bold text-ink">{cell.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="blueprint relative flex min-h-[290px] items-center justify-center overflow-hidden border-t border-line p-8 lg:order-2 lg:min-h-[430px] lg:border-s lg:border-t-0">
              <span className="font-latin pointer-events-none absolute -bottom-6 -start-4 text-[140px] font-black leading-none tracking-[-0.09em] text-ink/[0.035] sm:text-[180px]">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-4 rounded-[20px] border border-line/80" />
              <span className="absolute start-6 top-6 size-4 border-s-2 border-t-2 border-ink/25" />
              <span className="absolute end-6 bottom-6 size-4 border-b-2 border-e-2 border-ink/25" />

              <div className="relative size-full max-h-[330px]">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 34vw"
                  className="object-contain object-center drop-shadow-[0_22px_28px_rgba(10,11,10,0.16)] transition-all duration-700"
                />
              </div>

              <span className="absolute end-5 top-5 flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[10px] font-bold text-ink shadow-sm">
                <span className="size-1.5 rounded-full bg-signal" />
                {activeSlide.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-line bg-paper/60 px-5 py-3.5 sm:px-8">
            <div className="flex items-center gap-2" role="tablist" aria-label="اختيار العرض">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`شريحة ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-9 bg-ink"
                      : "w-2 bg-ink/15 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>

            <span className="hidden font-latin text-[10px] font-bold tracking-[0.18em] text-muted sm:block">
              {activeSlide.eyebrow}
            </span>

            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={goPrevious}
                aria-label="السابق"
                className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <ArrowLeft01Icon size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="التالي"
                className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                <ArrowRight01Icon size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <div className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-surface p-6 lg:min-h-0 lg:flex-1">
            <span className="font-latin pointer-events-none absolute -bottom-8 -start-4 text-[88px] font-black leading-none tracking-[-0.08em] text-ink/[0.03]">
              4090
            </span>
            <div className="relative">
              <div className="mb-5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-signal px-2.5 py-1 text-[10px] font-black text-ink">
                  صفقة اليوم
                </span>
                <span className="font-latin rounded-md border border-line px-2 py-1 text-[10px] font-bold text-muted">
                  4 LEFT
                </span>
              </div>
              <h3 className="max-w-xs text-[18px] font-black leading-snug tracking-tight text-ink">
                NVIDIA GeForce RTX 4090 24GB
              </h3>
              <p className="mt-2 max-w-xs text-[12px] leading-6 text-muted">
                أقوى أداء رسومي مع ضمان رسمي معتمد لثلاث سنوات.
              </p>
            </div>
            <div className="relative mt-6 flex items-end justify-between border-t border-line pt-4">
              <div>
                <div className="font-latin text-[11px] font-medium text-muted/70 line-through">
                  $1,899.00
                </div>
                <div className="font-latin mt-0.5 text-xl font-black tracking-tight text-ink">
                  $1,749.00
                </div>
              </div>
              <Link
                href="/products"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-ink px-4 text-[12px] font-bold text-white transition-colors hover:bg-brand-deep"
              >
                شراء الآن
                <ArrowRight01Icon size={14} className="rotate-180" />
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-paper p-6 lg:min-h-0 lg:flex-1">
            <div className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full border border-line" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-ink">
                <Ticket01Icon size={18} />
                <span className="eyebrow">كوبون إضافي</span>
              </div>
              <h3 className="max-w-xs text-[18px] font-black leading-snug tracking-tight text-ink">
                خصم 10% على كل التجميعات
              </h3>
              <p className="mt-2 max-w-xs text-[12px] leading-6 text-muted">
                استخدم الرمز عند الدفع مع شحن مجاني لكل المشتريات.
              </p>
            </div>
            <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="coupon-edge bg-signal px-4 py-2 font-latin text-xs font-black tracking-[0.16em] text-ink">
                PRO2026
              </span>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 border-b border-ink/20 pb-0.5 text-[12px] font-bold text-ink transition-colors hover:border-ink"
              >
                تصفح العروض
                <ArrowRight01Icon size={14} className="rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
