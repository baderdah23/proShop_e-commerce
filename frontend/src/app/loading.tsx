export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#1A1D2A]"
      role="status"
      aria-label="جاري تحميل الصفحة"
    >
      <div className="h-20 animate-pulse border-b border-black/5 bg-white" />
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded-full bg-[#DCE8F5]" />
        <section className="overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-[#EAF2FA]" />
            <div className="space-y-5 py-4">
              <div className="h-5 w-32 animate-pulse rounded-full bg-[#DCE8F5]" />
              <div className="h-12 w-4/5 animate-pulse rounded-xl bg-[#EAF2FA]" />
              <div className="h-5 w-full animate-pulse rounded-full bg-[#EAF2FA]" />
              <div className="h-16 w-2/5 animate-pulse rounded-2xl bg-[#EAF2FA]" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-[#DCE8F5]" />
            </div>
          </div>
        </section>
      </main>
      <span className="sr-only">جاري التحميل، يرجى الانتظار</span>
    </div>
  );
}
