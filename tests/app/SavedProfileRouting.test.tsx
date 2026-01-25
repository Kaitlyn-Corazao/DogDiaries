import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/app/App';
import * as api from '@/app/services/api';

vi.mock('@/app/services/api', () => ({
  listSavedProfiles: vi.fn(),
  getSavedProfile: vi.fn(),
  checkProfileExists: vi.fn(),
  saveProfile: vi.fn(),
  unsaveProfile: vi.fn(),
}));

// Ensure matchMedia exists for Toaster (sonner) in this test
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  })),
});

describe('Saved profile routing', () => {
  it('routes to detail view when clicking a saved card', async () => {
    const mockedApi = vi.mocked(api, true);
    const profile = {
      id: 'profile-123',
      name: 'Sparky',
      profession: 'Snack Inspector',
      family: 'Long line of biscuit connoisseurs',
      accomplishments: ['Found the treat jar', 'Guarded the couch'],
      lifeStory: 'A story about snacks.',
      pictureStory: 'A tale about naps.',
      imageUrl: 'https://example.com/sparky.jpg',
      createdAt: new Date().toISOString(),
    };

    mockedApi.listSavedProfiles.mockResolvedValue({ items: [profile], nextCursor: null });
    mockedApi.getSavedProfile.mockResolvedValue(profile);
    mockedApi.checkProfileExists.mockResolvedValue({ exists: false });

    render(<App />);

    const savedTailsBtn = await screen.findByRole('button', { name: /saved tails/i });
    await userEvent.click(savedTailsBtn);

    const cardBtn = await screen.findByRole('button', { name: /open profile for sparky/i });
    await userEvent.click(cardBtn);

    expect(window.location.pathname).toBe(`/saved/${profile.id}`);
    expect(mockedApi.getSavedProfile).toHaveBeenCalledWith(profile.id);

    await screen.findByRole('heading', { name: /sparky/i });
  });
});
