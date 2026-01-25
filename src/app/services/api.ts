export interface SavedProfile {
  id: string;
  name: string;
  profession: string;
  family: string;
  accomplishments: string[];
  lifeStory: string;
  pictureStory: string;
  imageUrl: string;
  createdAt: string; // ISO timestamp
}

export interface SavedProfileList {
  items: SavedProfile[];
  nextCursor: string | null;
}

const jsonHeaders = { 'Content-Type': 'application/json' } as const;

const parseJson = async <T>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
  return await res.json();
};

export async function checkProfileExists(
  params: { imageUrl: string; name: string }
): Promise<{ exists: boolean; id?: string }> {
  try {
    const url = `/api/saved-profiles/exists?imageUrl=${encodeURIComponent(
      params.imageUrl
    )}&name=${encodeURIComponent(params.name)}`;
    const res = await fetch(url);
    return await parseJson(res);
  } catch (e) {
    // Layout-first fallback: assume not saved
    return { exists: false };
  }
}

export async function saveProfile(body: Omit<SavedProfile, 'id' | 'createdAt'>): Promise<SavedProfile | null> {
  try {
    const res = await fetch('/api/saved-profiles', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(body),
    });
    return await parseJson(res);
  } catch (e) {
    return null;
  }
}

export async function unsaveProfile(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/saved-profiles/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error(`delete failed: ${res.status}`);
    return true;
  } catch (e) {
    return false;
  }
}

export async function listSavedProfiles(
  params: { cursor?: string; pageSize?: number } = {}
): Promise<SavedProfileList> {
  try {
    const q = new URLSearchParams();
    if (params.cursor) q.set('cursor', params.cursor);
    if (params.pageSize) q.set('pageSize', String(params.pageSize));
    const res = await fetch(`/api/saved-profiles?${q.toString()}`);
    return await parseJson(res);
  } catch (e) {
    // Layout-first fallback: empty list
    return { items: [], nextCursor: null };
  }
}

export async function getSavedProfile(id: string): Promise<SavedProfile | null> {
  try {
    const res = await fetch(`/api/saved-profiles/${encodeURIComponent(id)}`);
    return await parseJson(res);
  } catch (e) {
    return null;
  }
}
