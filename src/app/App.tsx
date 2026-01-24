import { useState } from "react";
import { DogProfile } from "@/app/components/DogProfile";
import { SavedProfiles } from "@/app/components/SavedProfiles";

export default function App() {
  const [view, setView] = useState<"profile" | "saved">("profile");

  return (
    <div className="size-full">
      {view === "profile" ? (
        <DogProfile onNavigateSaved={() => setView("saved")} />
      ) : (
        <SavedProfiles onNavigateHome={() => setView("profile")} />
      )}
    </div>
  );
}
