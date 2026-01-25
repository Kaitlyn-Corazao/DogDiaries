import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/app/App';

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

// Mock listSavedProfiles so SavedProfiles renders without network
vi.mock('@/app/services/api', () => ({
  listSavedProfiles: vi.fn().mockResolvedValue({ items: [], nextCursor: null })
}));

describe('App navigation', () => {
  it('navigates to Saved Profiles when clicking Saved Tails', async () => {
    render(<App />);

    const savedTailsBtn = await screen.findByRole('button', { name: /saved tails/i });
    await userEvent.click(savedTailsBtn);

    // SavedProfiles header should be present
    await screen.findByText(/saved tails/i);
  });
});
