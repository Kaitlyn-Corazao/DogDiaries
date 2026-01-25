import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SavedProfiles } from '@/app/components/SavedProfiles';
import * as api from '@/app/services/api';

// Mock listSavedProfiles API helper (hoisted-safe)
vi.mock('@/app/services/api', () => ({
  listSavedProfiles: vi.fn(),
}));

// Mock IntersectionObserver so we can manually trigger intersection events
let ioCallback: (entries: Array<{ isIntersecting: boolean }>) => void;
class MockIntersectionObserver {
  constructor(cb: (entries: Array<{ isIntersecting: boolean }>) => void) {
    ioCallback = cb;
  }
  observe() {}
  disconnect() {}
}

beforeEach(() => {
  // @ts-expect-error jsdom global patch
  global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
  (api.listSavedProfiles as unknown as ReturnType<typeof vi.fn>).mockReset?.();
});

describe('SavedProfiles grid', () => {
  it('loads initial batch and then loads next batch on intersection', async () => {
    // First batch
    (api.listSavedProfiles as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        items: [
          { id: 'a', name: 'Dog A', profession: 'Pro A', family: '', accomplishments: [], lifeStory: '', pictureStory: '', imageUrl: 'https://example.com/a.jpg', createdAt: new Date().toISOString() },
          { id: 'b', name: 'Dog B', profession: 'Pro B', family: '', accomplishments: [], lifeStory: '', pictureStory: '', imageUrl: 'https://example.com/b.jpg', createdAt: new Date().toISOString() },
        ],
        nextCursor: 'cursor1',
      })
      // Second batch
      .mockResolvedValueOnce({
        items: [
          { id: 'c', name: 'Dog C', profession: 'Pro C', family: '', accomplishments: [], lifeStory: '', pictureStory: '', imageUrl: 'https://example.com/c.jpg', createdAt: new Date().toISOString() },
        ],
        nextCursor: null,
      });

    render(<SavedProfiles />);

    // Wait for first batch to render
    await waitFor(() => {
      expect(screen.queryByText('Dog A')).not.toBeNull();
      expect(screen.queryByText('Dog B')).not.toBeNull();
    });

    // Trigger intersection to load next page
    ioCallback([{ isIntersecting: true }]);

    // Wait for second batch item
    await waitFor(() => {
      expect(screen.queryByText('Dog C')).not.toBeNull();
    });
  });

  it('shows empty state when no items', async () => {
    (api.listSavedProfiles as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ items: [], nextCursor: null });

    render(<SavedProfiles />);

    await waitFor(() => {
      expect(screen.queryByText('No saved profiles yet.')).not.toBeNull();
    });
  });
});
