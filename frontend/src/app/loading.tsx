export default function Loading() {
  return (
    <div
      className="min-h-screen bg-paper text-ink"
      role="status"
      aria-label="جاري تحميل الصفحة"
    >
      <div className="h-20 border-b border-line bg-surface">
        <div className="shell flex h-full items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 animate-pulse rounded-xl bg-brand-soft" />
            <div className="h-3 w-28 animate-pulse rounded-full bg-line" />
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="h-3 w-16 animate-pulse rounded-full bg-line" />
            <div className="h-3 w-16 animate-pulse rounded-full bg-line" />
            <div className="size-9 animate-pulse rounded-xl bg-brand-soft" />
          </div>
        </div>
      </div>

      <main className="shell py-12">
        <div className="space-y-8">
          <div className="h-3 w-48 animate-pulse rounded-full bg-brand-soft" />
          <section className="surface overflow-hidden p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-3xl bg-brand-soft" />
              <div className="space-y-5 py-4">
                <div className="h-4 w-32 animate-pulse rounded-full bg-line" />
                <div className="h-12 w-4/5 animate-pulse rounded-xl bg-brand-soft" />
                <div className="h-4 w-full animate-pulse rounded-full bg-line" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-line" />
                <div className="h-16 w-2/5 animate-pulse rounded-2xl bg-brand-soft" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-line" />
              </div>
            </div>
          </section>
        </div>
      </main>
      <span className="sr-only">جاري التحميل، يرجى الانتظار</span>
    </div>
  );
}
