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

export function TopNavigation({ header, currentUser }: Readonly<ITopNavigationProps>) {
  if (!header) return null
  const { logo, navItems, cta } = header
  const imageUrl = logo.image.url
  return (
    <section className="container mx-auto py-4">
      {/* Desktop Menu */}
      <nav className="hidden justify-between lg:flex">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            to={logo.href}
            className="flex items-center gap-2"
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            <StrapiImage
              src={imageUrl}
              alt={logo.image.alternativeText || logo.label}
              aspectRatio="icon"
            />

            <span className="text-lg font-semibold tracking-tighter">
              {logo.label}
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-center flex-1">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center justify-center">
              {navItems.map((item) => renderNavItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2 items-center">
          {currentUser ? (
            <LoggedInUser userData={{ username: currentUser.username || '', email: currentUser.email || '' }} />
          ) : (
            <Button
              asChild
              variant={cta.type === 'PRIMARY' ? 'default' : 'outline'}
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
      </nav>

      {/* Mobile Menu */}
      <div className="block lg:hidden mx-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to={logo.href}
            className="flex items-center gap-2"
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            <StrapiImage
              src={imageUrl}
              alt={logo.image.alternativeText || logo.label}
              aspectRatio="icon"
            />
          </Link>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
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
                    >
                      <StrapiImage
                        src={imageUrl}
                        alt={logo.image.alternativeText || logo.label}
                        aspectRatio="icon"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex w-full flex-col gap-4">
                    {navItems.map((item) => renderMobileNavItem(item))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {currentUser ? (
                      <LoggedInUser userData={{ username: currentUser.username || '', email: currentUser.email || '' }} />
                    ) : (
                      <Button
                        asChild
                        variant={cta.type === 'PRIMARY' ? 'default' : 'outline'}
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
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </div>
      </div>
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
          className="relative inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileNavItem = (item: TLink) => {
  return (
    <Link
      key={item.id}
      to={item.href}
      target={item.isExternal ? '_blank' : undefined}
      rel={item.isExternal ? 'noopener noreferrer' : undefined}
      className="relative inline-flex w-full py-3 text-md font-semibold transition-colors hover:text-foreground/80 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
    >
      {item.label}
    </Link>
  )
}
