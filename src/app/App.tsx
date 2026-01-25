import { useEffect, useMemo, useState } from "react";
import { DogProfile } from "@/app/components/DogProfile";
import { SavedProfiles } from "@/app/components/SavedProfiles";
import { SavedProfileDetail } from "@/app/components/SavedProfileDetail";
import { Toaster } from "@/app/components/ui/sonner";

type RouteState =
  | { name: "profile" }
  | { name: "saved" }
  | { name: "detail"; id: string };

const getRouteFromPath = (path: string): RouteState => {
  if (path.startsWith("/saved/")) {
    const id = decodeURIComponent(path.replace("/saved/", "").trim());
    if (id) return { name: "detail", id };
  }
  if (path === "/saved") return { name: "saved" };
  return { name: "profile" };
};

export default function App() {
  const initialRoute = useMemo(() => getRouteFromPath(window.location.pathname), []);
  const [route, setRoute] = useState<RouteState>(initialRoute);

  useEffect(() => {
    const handlePop = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(getRouteFromPath(path));
  };

  return (
    <div className="size-full">
      {route.name === "profile" && (
        <DogProfile onNavigateSaved={() => navigate("/saved")} />
      )}
      {route.name === "saved" && (
        <SavedProfiles
          onNavigateHome={() => navigate("/")}
          onNavigateDetail={(id) => navigate(`/saved/${encodeURIComponent(id)}`)}
        />
      )}
      {route.name === "detail" && (
        <SavedProfileDetail
          id={route.id}
          onNavigateBack={() => navigate("/saved")}
          onNavigateReplace={(id) => {
            window.history.replaceState({}, "", `/saved/${encodeURIComponent(id)}`);
            setRoute({ name: "detail", id });
          }}
        />
      )}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
