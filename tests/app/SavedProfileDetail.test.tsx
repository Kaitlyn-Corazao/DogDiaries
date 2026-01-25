import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavedProfileDetail } from '@/app/components/SavedProfileDetail';
import * as api from '@/app/services/api';

vi.mock('@/app/services/api', () => ({
  getSavedProfile: vi.fn(),
  saveProfile: vi.fn(),
  unsaveProfile: vi.fn(),
}));

// Ensure matchMedia exists for Toaster (sonner)
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

describe('SavedProfileDetail', () => {
  it('toggles unsave to save and re-saves the profile', async () => {
    const mockedApi = vi.mocked(api, true);
    const profile = {
      id: 'detail-1',
      name: 'Ruby',
      profession: 'Treat Archivist',
      family: 'Raised by biscuit collectors',
      accomplishments: ['Cataloged snacks', 'Solved the squeaky toy mystery'],
      lifeStory: 'A life of cataloging treats.',
      pictureStory: 'A tail about a nap.',
      imageUrl: 'https://example.com/ruby.jpg',
      createdAt: new Date().toISOString(),
    };

    mockedApi.getSavedProfile.mockResolvedValue(profile);
    mockedApi.unsaveProfile.mockResolvedValue(true);
    mockedApi.saveProfile.mockResolvedValue({ ...profile, id: 'detail-2' });

    const onNavigateReplace = vi.fn();
    render(<SavedProfileDetail id={profile.id} onNavigateReplace={onNavigateReplace} />);

    const unsaveButton = await screen.findByRole('button', { name: /remove tail/i });
    await userEvent.click(unsaveButton);

    const saveButton = await screen.findByRole('button', { name: /save tail/i });
    await userEvent.click(saveButton);

    expect(mockedApi.unsaveProfile).toHaveBeenCalledWith(profile.id);
    expect(mockedApi.saveProfile).toHaveBeenCalled();
    expect(onNavigateReplace).toHaveBeenCalledWith('detail-2');
  });
});
