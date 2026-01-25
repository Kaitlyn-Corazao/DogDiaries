import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DogProfile } from '@/app/components/DogProfile';

// Mock API helpers used by DogProfile
vi.mock('@/app/services/api', () => {
  return {
    checkProfileExists: vi.fn().mockResolvedValue({ exists: false }),
    saveProfile: vi.fn().mockResolvedValue({ id: 'id-123' }),
    unsaveProfile: vi.fn().mockResolvedValue(true),
  };
});

// Mock fetch for dog-image and generate-profile
beforeEach(() => {
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.includes('/api/dog-image')) {
      return new Response(JSON.stringify({ imageUrl: 'https://example.com/dog.jpg' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('/api/generate-profile')) {
      const body = {
        name: 'Sir Barkington III',
        profession: 'Professional Ball Chaser',
        family: 'Line of distinguished retrievers',
        accomplishments: ['Caught tail once', 'Never missed a meal'],
        lifeStory: 'Loves naps and sunbeams.',
        pictureStory: 'Just discovered a new smell.',
        imageUrl: 'https://example.com/dog.jpg',
      };
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('{}', { status: 404 });
  }) as unknown as typeof fetch;
});

describe('DogProfile save/unsave toggle', () => {
  it('generates a profile and toggles save -> unsave -> save', async () => {
    render(<DogProfile />);

    // Click to generate a profile
    const unleashBtn = await screen.findByRole('button', { name: /unleash the story/i });
    await userEvent.click(unleashBtn);

    // Save button appears after profile loads
    const saveBtn = await screen.findByRole('button', { name: /save tail/i });
    await userEvent.click(saveBtn);

    // After saving, button changes to Remove Tail
    const unsaveBtn = await screen.findByRole('button', { name: /remove tail/i });
    await userEvent.click(unsaveBtn);

    // Back to Save Tail
    await screen.findByRole('button', { name: /save tail/i });

    // Sanity check: heading present
    await screen.findByText(/meet sir barkington iii/i);
  });
});
