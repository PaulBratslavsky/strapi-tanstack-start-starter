import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from './theme-toggle'
import { StrapiImage } from './strapi-image'
import { LoggedInUser } from './logged-in-user'
import type { THeader, TLink } from '../../types'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ITopNavigationProps {
  header?: THeader
  currentUser?: {
    userId: number
    email?: string
    username?: string
  } | null
}

export function TopNavigation({
  header,
  currentUser,
}: Readonly<ITopNavigationProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!header) return null
  const { logo, navItems, cta } = header
  const imageUrl = logo.image.url
  return (
    <section className="bg-white dark:bg-dark p-6 flex justify-center items-center">
      {/* Desktop Menu */}
      <nav className="w-full max-w-7xl bg-background shadow-shadow border-2 border-border rounded-lg px-4 hidden lg:block">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={logo.href}
            className="flex items-center gap-2 text-foreground hover:text-main transition-colors"
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            <StrapiImage
              src={imageUrl}
              alt={logo.image.alternativeText || logo.label}
              aspectRatio="square"
              height={40}
              width={40}
            />
            <span className="text-lg font-semibold tracking-tighter">
              {logo.label}
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-8">
                {navItems.map((item) => renderNavItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA / User Actions */}
          <div className="flex gap-2 items-center">
            {currentUser ? (
              <LoggedInUser
                userData={{
                  username: currentUser.username || '',
                  email: currentUser.email || '',
                }}
              />
            ) : (
              <Button
                asChild
                variant={cta.type === 'PRIMARY' ? 'default' : 'neutral'}
                size="default"
              >
                <Link
                  to={cta.href}
                  target={cta.isExternal ? '_blank' : undefined}
                  rel={cta.isExternal ? 'noopener noreferrer' : undefined}
                >
                  {cta.label}
                </Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav className="w-full bg-background shadow-shadow border-2 border-border rounded-lg px-4 block lg:hidden">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={logo.href}
            className="flex items-center gap-2 text-foreground hover:text-main transition-colors"
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            <StrapiImage
              src={imageUrl}
              alt={logo.image.alternativeText || logo.label}
              aspectRatio="square"
              height={40}
              width={40}
            />
          </Link>
          <div className="flex gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      to={logo.href}
                      className="flex items-center gap-2"
                      target={logo.isExternal ? '_blank' : undefined}
                      rel={logo.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <StrapiImage
                        src={imageUrl}
                        alt={logo.image.alternativeText || logo.label}
                        aspectRatio="square"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex w-full flex-col gap-4">
                    {navItems.map((item) =>
                      renderMobileNavItem(item, () => setMobileMenuOpen(false))
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {currentUser ? (
                      <LoggedInUser
                        userData={{
                          username: currentUser.username || '',
                          email: currentUser.email || '',
                        }}
                      />
                    ) : (
                      <Button
                        asChild
                        variant={cta.type === 'PRIMARY' ? 'default' : 'neutral'}
                      >
                        <Link
                          to={cta.href}
                          target={cta.isExternal ? '_blank' : undefined}
                          rel={
                            cta.isExternal ? 'noopener noreferrer' : undefined
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {cta.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </section>
  )
}

const renderNavItem = (item: TLink) => {
  return (
    <NavigationMenuItem key={item.id}>
      <NavigationMenuLink
        asChild
        className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent"
      >
        <Link
          to={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          className="text-foreground hover:text-main transition-colors font-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY"
        >
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileNavItem = (item: TLink, onNavigate: () => void) => {
  return (
    <Button key={item.id} asChild variant="neutral" className="w-full justify-start">
      <Link
        to={item.href}
        target={item.isExternal ? '_blank' : undefined}
        rel={item.isExternal ? 'noopener noreferrer' : undefined}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    </Button>
  )
}
