import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoIcon from "@/assets/DogDiaries_Logo.png";
import { getSavedProfile, saveProfile, SavedProfile, unsaveProfile } from "@/app/services/api";
import { toast } from "sonner";

type SavedProfileDetailProps = {
  id: string;
  onNavigateBack?: () => void;
  onNavigateReplace?: (id: string) => void;
};

export function SavedProfileDetail({ id, onNavigateBack, onNavigateReplace }: SavedProfileDetailProps) {
  const [profile, setProfile] = useState<SavedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const data = await getSavedProfile(id);
      if (!active) return;
      if (!data) {
        setError("Profile not found.");
        setProfile(null);
        setIsSaved(false);
      } else {
        setProfile(data);
        setIsSaved(true);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleSave = async () => {
    if (!profile || saving) return;
    setSaving(true);
    if (isSaved) {
      const ok = await unsaveProfile(profile.id);
      if (!ok) {
        toast.error("Failed to unsave profile.");
      } else {
        toast.success("Profile removed from saved tails.");
        setIsSaved(false);
      }
      setSaving(false);
      return;
    }

    const saved = await saveProfile({
      name: profile.name,
      profession: profile.profession,
      family: profile.family,
      accomplishments: profile.accomplishments,
      lifeStory: profile.lifeStory,
      pictureStory: profile.pictureStory,
      imageUrl: profile.imageUrl,
    });

    if (!saved) {
      toast.error("Failed to save profile.");
      setSaving(false);
      return;
    }

    toast.success("Profile saved to Saved Tails.");
    setProfile(saved);
    setIsSaved(true);
    if (saved.id !== profile.id && onNavigateReplace) {
      onNavigateReplace(saved.id);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#e8dcc8]">
      <header className="border-b border-amber-200 bg-[#faf8f4]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIcon} alt="Dog Diaries Logo" className="size-20" />
            <h1 className="text-xl tracking-tight text-amber-900">The Dog Diaries</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button
              onClick={() => onNavigateBack && onNavigateBack()}
              className="bg-white text-amber-900 border border-amber-900 rounded-none h-9 px-4 hover:bg-amber-900 hover:text-white"
            >
              Saved Tails
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-16" aria-busy={loading}>
        {loading && (
          <div className="text-center text-gray-600 py-6" role="status" aria-live="polite">
            Loading profile...
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-gray-700 py-10" role="status" aria-live="polite">
            {error}
          </div>
        )}

        {!loading && profile && (
          <div className="space-y-12">
            <nav className="text-sm text-amber-800" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={() => onNavigateBack && onNavigateBack()}
                className="hover:underline"
              >
                Saved Tails
              </button>
              <span className="mx-2 text-amber-600">/</span>
              <span className="text-amber-900">{profile.name}</span>
            </nav>

            <div className="text-center">
              <h2 className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6 leading-tight">
                Meet {profile.name}
              </h2>
              <p className="text-xl text-gray-600">{profile.profession}</p>
            </div>

            <Card className="overflow-hidden border-none shadow-sm rounded-2xl bg-white">
              <div className="relative">
                <div className="relative overflow-hidden h-[600px] w-full">
                  <img
                    src={profile.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md brightness-90 saturate-50"
                  />
                  <div className="relative flex items-center justify-center h-full w-full p-4">
                    <ImageWithFallback
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>
              </div>

              <div className="p-12 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">The tail</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{profile.pictureStory}</p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Family Background</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {profile.name} {profile.family || ""}
                  </p>
                </section>

                <section>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Biography</h3>
                  <p className="text-gray-800 leading-relaxed">{profile.lifeStory}</p>
                </section>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Notable Accomplishments</h3>
                  <ul className="space-y-3">
                    {profile.accomplishments.map((item, index) => (
                      <li key={`${profile.id}-acc-${index}`} className="text-gray-800 leading-relaxed pl-4 border-l-2 border-gray-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="pt-8 border-t border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This profile is a work of fiction created for entertainment purposes. Any resemblance to actual dogs, living or departed, is purely coincidental.
                  </p>
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <Button
                    onClick={handleToggleSave}
                    disabled={saving || loading || !profile}
                    className="bg-amber-900 hover:bg-amber-800 text-white rounded-none h-9 px-4"
                  >
                    {saving ? "Updating..." : isSaved ? "Remove Tail" : "Save Tail"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
