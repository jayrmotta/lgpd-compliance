"use client"

import { useRouter } from 'next/navigation'
import { LogOut, Building2, Settings, User, Home } from 'lucide-react'
import { RainbowGem } from '@/components/ui/rainbow-gem'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/lib/auth-client'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'data_subject':
        return 'Usuário'
      case 'admin':
        return 'Administrador'
      case 'employee':
        return 'Funcionário'
      case 'super_admin':
        return 'Super Admin'
      default:
        return 'Usuário'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'data_subject':
        return <User className="h-4 w-4" />
      case 'admin':
      case 'employee':
        return <Building2 className="h-4 w-4" />
      case 'super_admin':
        return <Settings className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getNavigationOptions = () => {
    const options = []

    switch (user?.role) {
      case 'data_subject':
        options.push(
          {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <Home className="h-4 w-4" />
          }
        )
        break
      
      case 'admin':
        options.push(
          {
            label: 'Dashboard da Empresa',
            href: '/company-dashboard',
            icon: <Building2 className="h-4 w-4" />
          },
          {
            label: 'Configuração da Empresa',
            href: '/company-setup',
            icon: <Settings className="h-4 w-4" />
          }
        )
        break
      
      case 'employee':
        options.push(
          {
            label: 'Dashboard da Empresa',
            href: '/company-dashboard',
            icon: <Building2 className="h-4 w-4" />
          }
        )
        break
      
      case 'super_admin':
        options.push(
          {
            label: 'Painel Administrativo',
            href: '/admin',
            icon: <Settings className="h-4 w-4" />
          }
        )
        break
    }

    return options
  }

  const navigationOptions = getNavigationOptions()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side - Logo and title - Always visible */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <RainbowGem className="h-8 w-8" />
            <span className="text-xl font-bold">Prisma</span>
          </div>
          
          {title && (
            <>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            </>
          )}
        </div>

        {/* Right side - User menu and navigation - Async loading */}
        <div className="flex items-center gap-4">
          {/* Navigation options for the current role - Show skeleton while loading */}
          {loading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          ) : user && navigationOptions.length > 0 ? (
            <div className="flex items-center gap-2">
              {navigationOptions.map((option) => (
                <Button
                  key={option.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(option.href)}
                  className="flex items-center gap-2"
                >
                  {option.icon}
                  {option.label}
                </Button>
              ))}
            </div>
          ) : null}

          {/* User dropdown menu - Show skeleton while loading */}
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user?.email || 'Usuário'}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getRoleIcon(user?.role || 'data_subject')}
                      {getRoleDisplayName(user?.role || 'data_subject')}
                    </div>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Navigation options in dropdown for mobile */}
                {navigationOptions.length > 0 && (
                  <>
                    {navigationOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.href}
                        onClick={() => router.push(option.href)}
                        className="flex items-center gap-2"
                      >
                        {option.icon}
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  )
}
