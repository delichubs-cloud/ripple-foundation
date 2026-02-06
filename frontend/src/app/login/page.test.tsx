/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginPage from '@/app/login/page';
import { SessionProvider } from 'next-auth/react';
import * as nextAuthReact from 'next-auth/react';
import * as nextNavigation from 'next/navigation';

// Mock next-auth/react
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (nextAuthReact.useSession as vi.Mock).mockReturnValue({ 
      data: null, 
      status: 'unauthenticated' 
    });
  });

  describe('Rendering', () => {
    it('should render the login page title', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      // Use getAllByText since Ripple Foundation appears multiple times
      expect(screen.getAllByText(/Ripple Foundation/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    });

    it('should render Google OAuth login button with correct aria-label', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      const googleButton = screen.getByRole('button', { name: /Sign in with Google/i });
      expect(googleButton).toBeInTheDocument();
    });

    it('should render a hero section with welcome message', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
      expect(screen.getByText(/Join our community/i)).toBeInTheDocument();
    });
  });

  describe('Google OAuth Button', () => {
    it('should call signIn with "google" when Google button is clicked', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      const googleButton = screen.getByRole('button', { name: /Sign in with Google/i });
      fireEvent.click(googleButton);
      
      expect(nextAuthReact.signIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
    });

    it('should show loading spinner when status is loading', () => {
      (nextAuthReact.useSession as vi.Mock).mockReturnValue({ 
        data: null, 
        status: 'loading' 
      });
      
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      // The loading spinner is a div with animate-spin class
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should not show Google button when authenticated', () => {
      (nextAuthReact.useSession as vi.Mock).mockReturnValue({ 
        data: { user: { name: 'Test User' } }, 
        status: 'authenticated' 
      });
      
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      const googleButton = screen.queryByRole('button', { name: /Sign in with Google/i });
      expect(googleButton).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have buttons with accessible names', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('UI Elements', () => {
    it('should render the footer with copyright', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      expect(screen.getByText(/© 2024 Ripple Foundation/i)).toBeInTheDocument();
    });

    it('should render feature icons', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      expect(screen.getByText(/Secure Auth/i)).toBeInTheDocument();
      expect(screen.getByText(/Women Community/i)).toBeInTheDocument();
      expect(screen.getByText(/Empowerment/i)).toBeInTheDocument();
    });

    it('should render divider with "or" text', () => {
      render(
        <SessionProvider session={null}>
          <LoginPage />
        </SessionProvider>
      );
      
      expect(screen.getByText(/or/i)).toBeInTheDocument();
    });
  });
});
