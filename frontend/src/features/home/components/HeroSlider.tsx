"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FlashIcon,
  Shield01Icon,
  DeliveryTruck01Icon,
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ============================================================
            MAIN PROMOTIONAL SLIDER (8 Cols on Desktop)
            ============================================================ */}
        <div
          className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#18191D] via-[#101114] to-[#0A0A0C] text-white border border-white/10 shadow-lg min-h-[420px] sm:min-h-[460px] flex flex-col justify-between"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Background Pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Slide Visual Background (Clean fade) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-10 -bottom-10 w-80 sm:w-96 aspect-square opacity-20 sm:opacity-30 blur-2xl rounded-full bg-neutral-600" />
            <div className="absolute left-0 bottom-0 top-0 w-full sm:w-1/2 flex items-center justify-center p-6 opacity-40 sm:opacity-90">
              <div className="relative w-full h-full max-h-[320px]">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-center drop-shadow-2xl transition-all duration-700"
                />
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-xl text-start flex-1 flex flex-col justify-center">
            {/* Tag / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15">
                <FlashIcon size={14} className="fill-amber-400 text-amber-400" />
                <span>{activeSlide.eyebrow}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#EF4444] text-white">
                {activeSlide.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-2">
              {activeSlide.title}
              <span className="block text-neutral-300 font-extrabold text-xl sm:text-3xl mt-1">
                {activeSlide.titleAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mb-6">
              {activeSlide.subtitle}
            </p>

            {/* Price Note & CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={activeSlide.href}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] hover:bg-neutral-100 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                <span>{activeSlide.cta}</span>
                <ArrowRight01Icon size={16} className="rotate-180" />
              </Link>
              <div className="text-start">
                <span className="text-[10px] text-neutral-400 block font-medium">
                  عرض خاص
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {activeSlide.priceNote}
                </span>
              </div>
            </div>
          </div>

          {/* Slider Controls Bar */}
          <div className="relative z-10 px-6 sm:px-10 py-4 border-t border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-sm">
            <div className="flex items-center gap-2" role="tablist" aria-label="اختيار العرض">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`شريحة ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={goPrevious}
                aria-label="السابق"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ArrowLeft01Icon size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="التالي"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ArrowRight01Icon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            SIDE PROMO DEAL CARDS (4 Cols on Desktop)
            ============================================================ */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Deal of the Day (صفقة اليوم) */}
          <div className="bg-white rounded-3xl p-5 border border-black/8 shadow-sm flex-1 flex flex-col justify-between hover:border-black/25 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2.5 py-1 rounded-lg">
                  <FlashIcon size={14} className="fill-[#EF4444]" />
                  <span>صفقة اليوم السريعة</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  متبقي 4 قطع
                </span>
              </div>
              <h3 className="font-extrabold text-base text-[#1A1D2A] leading-snug mb-1">
                NVIDIA GeForce RTX 4090 24GB
              </h3>
              <p className="text-xs text-[#64748B] mb-3">
                أقوى بطاقة رسوميات في العالم مع ضمان رسمي معتمد 3 سنوات.
              </p>
            </div>

            <div className="pt-3 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#94A3B8] line-through block font-medium">
                  $1,899.00
                </span>
                <span className="text-base font-black text-[#1A1D2A]">
                  $1,749.00
                </span>
              </div>
              <Link
                href="/products"
                className="bg-[#111111] hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                شراء الآن
              </Link>
            </div>
          </div>

          {/* Card 2: Coupon & Store Perks */}
          <div className="bg-gradient-to-br from-[#111111] to-[#1F2228] text-white rounded-3xl p-5 border border-black/10 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Ticket01Icon size={18} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  كوبون خصم إضافي
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white leading-snug mb-1">
                خصم 10% على كل التجميعات
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                استخدم الرمز عند الدفع مع شحن مجاني وسريع لكافة المشتريات.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              <span className="font-mono font-bold text-xs bg-white/15 px-3 py-1.5 rounded-lg border border-white/20 tracking-wider">
                PRO2026
              </span>
              <Link
                href="/products"
                className="text-xs font-bold text-[#AACFF0] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>تصفح العروض</span>
                <ArrowRight01Icon size={14} className="rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
