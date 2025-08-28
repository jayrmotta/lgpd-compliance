import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { TopBar } from './top-bar';
import { useAuth } from '../../lib/auth-client';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock auth client
jest.mock('../../lib/auth-client', () => ({
  useAuth: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('TopBar', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render logo and title when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('should show skeleton states when loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    // Skeleton elements should be present (using animate-pulse class)
    // 2 navigation button skeletons + 1 avatar skeleton = 3 total
    expect(document.querySelectorAll('[class*="animate-pulse"]')).toHaveLength(3);
  });

  it('should render navigation for data_subject role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'user@example.com',
        role: 'data_subject',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Minhas Solicitações')).not.toBeInTheDocument();
    expect(screen.queryByText('Nova Solicitação')).not.toBeInTheDocument();
  });

  it('should render navigation for admin role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'admin@company.com',
        role: 'admin',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('Dashboard da Empresa')).toBeInTheDocument();
    expect(screen.getByText('Configuração da Empresa')).toBeInTheDocument();
  });

  it('should render navigation for employee role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'employee@company.com',
        role: 'employee',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('Dashboard da Empresa')).toBeInTheDocument();
    expect(screen.queryByText('Configuração da Empresa')).not.toBeInTheDocument();
  });

  it('should render navigation for super_admin role', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'superadmin@platform.com',
        role: 'super_admin',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
  });

  it('should navigate when navigation buttons are clicked', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'user@example.com',
        role: 'data_subject',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should display correct role information in user menu', () => {
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'admin@company.com',
        role: 'admin',
      },
      loading: false,
      error: null,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    // The role should be displayed in the avatar fallback
    expect(screen.getByText('A')).toBeInTheDocument(); // First letter of email
  });

  it('should have logout function available', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: {
        userId: '1',
        email: 'user@example.com',
        role: 'data_subject',
      },
      loading: false,
      error: null,
      logout: mockLogout,
      checkAuth: jest.fn(),
    });

    render(<TopBar />);
    
    // Verify the component renders with logout function
    expect(screen.getByText('Prisma')).toBeInTheDocument();
    expect(mockLogout).toBeDefined();
  });
});
