import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/app/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import logoIcon from "@/assets/DogDiaries_Logo.png";

interface DogData {
  name: string;
  profession: string;
  family: string;
  accomplishments: string[];
  lifeStory: string;
  pictureStory: string;
  imageUrl: string;
}

export function DogProfile() {
  const [dogData, setDogData] = useState<DogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch random dog image from API
      const imageResponse = await fetch('/api/dog-image');
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch dog image: ${imageResponse.status}`);
      }
      const imageData = await imageResponse.json();
      
      // Generate profile with dog image
      const profileResponse = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageData.imageUrl }),
      });
      
      if (!profileResponse.ok) {
        throw new Error(`Failed to generate profile: ${profileResponse.status}`);
      }
      
      const profileData = await profileResponse.json();
      setDogData(profileData);
    } catch (err) {
      console.error('Error generating dog profile:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate dog story. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8dcc8] relative">
      {/* Header Navigation */}
      <header className="border-b border-amber-200 bg-[#faf8f4] relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setDogData(null)}
          >
            <img src={logoIcon} alt="Dog Diaries Logo" className="size-20" />
            <h1 className="text-xl tracking-tight text-amber-900">
              The Dog Diaries
            </h1>
          </div>
          <nav className="flex items-center gap-8">
            {dogData && (
              <Button
                onClick={generateProfile}
                disabled={loading}
                className="bg-amber-900 hover:bg-amber-800 text-white px-6 py-2 text-sm rounded-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Unleashing...
                  </>
                ) : (
                  "Unleash new story"
                )}
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Background Collage */}
      {!dogData && (
        <div className="fixed inset-x-0 bottom-0 top-[73px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-8 p-8" style={{
            filter: 'sepia(40%) contrast(1.1)',
            opacity: '0.15'
          }}>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1603459806507-b6c21fab1d1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY4Njk2NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1657696491528-e425e6aadfb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBuZXdzcGFwZXIlMjBzdHlsZXxlbnwxfHx8fDE3Njg2OTY2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1653271825175-8edee5a844c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZG9nJTIwcGhvdG98ZW58MXx8fHwxNzY4Njk2NjYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521781611152-956a7c6ab404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjbG9zZSUyMHVwJTIwbW9ub2Nocm9tZXxlbnwxfHx8fDE3Njg2OTY2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1672184326714-0b07dbe68a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBzaWRlJTIwcHJvZmlsZXxlbnwxfHx8fDE3Njg2OTY2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1644159481256-744dafc3a5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBsb29raW5nJTIwY2FtZXJhfGVufDF8fHx8MTc2ODY5NjY2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1620658383483-3506a22d99c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwb3J0cmFpdCUyMGJsYWNrJTIwd2hpdGV8ZW58MXx8fHwxNzY4Njk2Nzg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1610701144220-6f5da77f7248?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXBweSUyMGZhY2UlMjBjbG9zZXVwfGVufDF8fHx8MTc2ODY5Njc4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1763070955788-b3c3bad3aa8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBzaXR0aW5nJTIwbG9va2luZ3xlbnwxfHx8fDE3Njg2OTY3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1603459806507-b6c21fab1d1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdoaXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY4Njk2NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521781611152-956a7c6ab404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjbG9zZSUyMHVwJTIwbW9ub2Nocm9tZXxlbnwxfHx8fDE3Njg2OTY2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
            <div className="w-full h-full bg-cover bg-center" style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1672184326714-0b07dbe68a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBzaWRlJTIwcHJvZmlsZXxlbnwxfHx8fDE3Njg2OTY2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
            }}></div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-8 py-16">
        {/* Error Alert */}
        {error && (
          <div className="mb-8">
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Hero Section */}
        {!dogData && (
          <div className="text-center mb-16">
            <h2 className="text-6xl md:text-7xl tracking-tight text-amber-950 mb-8 leading-tight">
              What are they doing?
            </h2>
            <p className="text-2xl md:text-3xl text-amber-800 mb-12 max-w-3xl mx-auto font-light">
              The tails we caught them living
            </p>
            <Button
              onClick={generateProfile}
              disabled={loading}
              className="bg-amber-900 hover:bg-amber-800 text-white px-8 py-6 text-base rounded-none shadow-lg relative z-10 opacity-100"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 size-4 animate-spin" />
                  Unleashing...
                </>
              ) : (
                "Unleash the story"
              )}
            </Button>
          </div>
        )}

        {/* Dog Profile */}
        {dogData && (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Title Section */}
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl tracking-tight text-gray-900 mb-6 leading-tight">
                Meet {dogData.name}
              </h2>
              <p className="text-xl text-gray-600">{dogData.profession}</p>
            </div>

            {/* Image Section */}
            <Card className="overflow-hidden border-none shadow-sm rounded-2xl bg-white">
              <div className="relative">
                <img
                  src={dogData.imageUrl}
                  alt={dogData.name}
                  className="w-full h-[600px] object-cover"
                />
              </div>
              
              {/* Picture Story */}
              <div className="p-12 bg-gradient-to-br from-gray-50 to-white">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">The tail</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {dogData.pictureStory}
                </p>
              </div>
            </Card>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-12 mt-16">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Family Background */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Family Background</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {dogData.name} {dogData.family}
                  </p>
                </div>

                {/* Life Story */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Biography</h3>
                  <p className="text-gray-800 leading-relaxed">
                    {dogData.lifeStory}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Accomplishments */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Notable Accomplishments</h3>
                  <ul className="space-y-3">
                    {dogData.accomplishments.map((accomplishment, index) => (
                      <li key={index} className="text-gray-800 leading-relaxed pl-4 border-l-2 border-gray-300">
                        {accomplishment}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This profile is a work of fiction created for entertainment purposes. Any resemblance to actual dogs, living or departed, is purely coincidental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}