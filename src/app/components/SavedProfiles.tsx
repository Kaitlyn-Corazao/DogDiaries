import { useEffect, useRef, useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { listSavedProfiles, SavedProfile } from "@/app/services/api";
import logoIcon from "@/assets/DogDiaries_Logo.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

type SavedProfilesProps = {
  onNavigateHome?: () => void;
  onNavigateDetail?: (id: string) => void;
};

export function SavedProfiles({ onNavigateHome, onNavigateDetail }: SavedProfilesProps) {
  const [items, setItems] = useState<SavedProfile[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const shouldLogTiming = import.meta.env.DEV;

  const load = async () => {
    const start = typeof performance !== "undefined" ? performance.now() : 0;
    setLoading(true);
    const { items: batch, nextCursor } = await listSavedProfiles({
      cursor: cursor ?? undefined,
      pageSize: 12,
    });
    setItems((prev) => [...prev, ...batch]);
    setCursor(nextCursor ?? null);
    setLoading(false);
    if (shouldLogTiming && start) {
      const elapsed = performance.now() - start;
      console.debug(`SavedProfiles load: ${elapsed.toFixed(1)}ms`);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading && cursor) {
        load();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [cursor, loading]);

  return (
    <div className="min-h-screen bg-[#e8dcc8]">
      {/* Header */}
      <header className="border-b border-amber-200 bg-[#faf8f4]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Dog Diaries Logo" className="size-20" />
            <h1 className="text-xl tracking-tight text-amber-900">The Dog Diaries</h1>
          </div>
          <Button
            onClick={() => onNavigateHome && onNavigateHome()}
            className="bg-amber-900 hover:bg-amber-800 text-white rounded-none h-9 px-6"
          >
            Home
          </Button>
        </div>
      </header>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 pt-16" aria-busy={loading}>
        <div className="text-center mb-6">
          <h2 className="text-6xl tracking-tight text-amber-950">Saved Tails</h2>
        </div>
        <div className="text-center mb-10">
          <p className="text-amber-800 text-xl">Your collection of memorable dog tales</p>
        </div>

        {/* Grid */}
        {items.length === 0 && !loading ? (
          <div className="text-center text-gray-600 py-24" role="status" aria-live="polite">
            No saved profiles yet.
          </div>
        ) : (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Saved profiles">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigateDetail && onNavigateDetail(p.id)}
                className="text-left transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                aria-label={`Open profile for ${p.name}`}
              >
                <Card className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow h-full">
                  <div className="w-full h-[333px] overflow-hidden">
                    <ImageWithFallback src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-6 pt-6 pb-8 h-[148px] flex flex-col gap-2">
                    <div
                      className="text-2xl text-gray-900 font-medium leading-8 min-h-[64px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                    >
                      {p.name}
                    </div>
                    <div
                      className="text-sm text-gray-600 leading-5 min-h-[40px] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]"
                    >
                      {p.profession}
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </section>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-8" />

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600 py-6" role="status" aria-live="polite">
            Loading more...
          </div>
        )}
      </div>

    </div>
  );
}
