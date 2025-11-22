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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// Simplified user type - only what we need for navigation
interface NavigationUser {
  username: string
  email: string
}

interface ITopNavigationProps {
  header?: THeader
  currentUser?: NavigationUser | null
}

const styles = {
  section: 'bg-white dark:bg-dark p-6 flex justify-center items-center',
  desktopNav: 'container mx-auto w-full bg-background shadow-shadow border-2 border-border rounded-lg px-6 hidden lg:block',
  desktopNavInner: 'flex items-center justify-between h-20',
  logoLink: 'flex items-center gap-3 text-foreground hover:text-main transition-colors',
  logoText: 'text-2xl font-bold tracking-tight font-heading',
  navItemsContainer: 'flex items-center space-x-8',
  navList: 'flex items-center space-x-8',
  ctaContainer: 'flex gap-2 items-center',
  mobileNav: 'w-full bg-background shadow-shadow border-2 border-border rounded-lg px-4 block lg:hidden',
  mobileNavInner: 'flex items-center justify-between h-16',
  mobileActionsContainer: 'flex gap-2',
  mobileMenuButton: 'size-4',
  sheetContent: 'overflow-y-auto',
  sheetHeaderLink: 'flex items-center gap-2',
  sheetDescription: 'sr-only',
  mobileNavItems: 'flex flex-col gap-6 p-4',
  mobileNavList: 'flex w-full flex-col gap-4',
  mobileCtaContainer: 'flex flex-col gap-3',
  navMenuLink: 'bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent',
  navItemLink: 'text-xl font-bold text-foreground hover:text-main transition-colors hover:translate-x-boxShadowX hover:translate-y-boxShadowY',
  mobileNavButton: 'w-full justify-start',
}

export function TopNavigation({
  header,
  currentUser,
}: Readonly<ITopNavigationProps>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!header) return null
  const { logo, navItems = [], cta } = header
  const imageUrl = logo.image?.url

  return (
    <section className={styles.section}>
      {/* Desktop Menu */}
      <nav className={styles.desktopNav}>
        <div className={styles.desktopNavInner}>
          {/* Logo */}
          <Link
            to={logo.href}
            className={styles.logoLink}
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            {imageUrl && (
              <StrapiImage
                src={imageUrl}
                alt={logo.image?.alternativeText || logo.label}
                aspectRatio="square"
                height={32}
                width={32}
              />
            )}
            <span className={styles.logoText}>
              {logo.label}
            </span>
          </Link>

          {/* Navigation Items */}
          <div className={styles.navItemsContainer}>
            <NavigationMenu>
              <NavigationMenuList className={styles.navList}>
                {navItems.map((item) => renderNavItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA / User Actions */}
          <div className={styles.ctaContainer}>
            {currentUser ? (
              <LoggedInUser
                userData={{
                  username: currentUser.username || '',
                  email: currentUser.email || '',
                }}
              />
            ) : cta ? (
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
            ) : null}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav className={styles.mobileNav}>
        <div className={styles.mobileNavInner}>
          {/* Logo */}
          <Link
            to={logo.href}
            className={styles.logoLink}
            target={logo.isExternal ? '_blank' : undefined}
            rel={logo.isExternal ? 'noopener noreferrer' : undefined}
          >
            {imageUrl && (
              <StrapiImage
                src={imageUrl}
                alt={logo.image?.alternativeText || logo.label}
                aspectRatio="square"
                height={40}
                width={40}
              />
            )}
          </Link>
          <div className={styles.mobileActionsContainer}>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className={styles.mobileMenuButton} />
                </Button>
              </SheetTrigger>

              <SheetContent className={styles.sheetContent}>
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      to={logo.href}
                      className={styles.sheetHeaderLink}
                      target={logo.isExternal ? '_blank' : undefined}
                      rel={logo.isExternal ? 'noopener noreferrer' : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {imageUrl && (
                        <StrapiImage
                          src={imageUrl}
                          alt={logo.image?.alternativeText || logo.label}
                          aspectRatio="square"
                        />
                      )}
                    </Link>
                  </SheetTitle>
                  <SheetDescription className={styles.sheetDescription}>
                    Mobile navigation menu
                  </SheetDescription>
                </SheetHeader>
                <div className={styles.mobileNavItems}>
                  <div className={styles.mobileNavList}>
                    {navItems.map((item) =>
                      renderMobileNavItem(item, () => setMobileMenuOpen(false)),
                    )}
                  </div>

                  <div className={styles.mobileCtaContainer}>
                    {currentUser ? (
                      <LoggedInUser
                        userData={{
                          username: currentUser.username || '',
                          email: currentUser.email || '',
                        }}
                      />
                    ) : cta ? (
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
                    ) : null}
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
        className={styles.navMenuLink}
      >
        <Link
          to={item.href}
          target={item.isExternal ? '_blank' : undefined}
          rel={item.isExternal ? 'noopener noreferrer' : undefined}
          className={styles.navItemLink}
        >
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileNavItem = (item: TLink, onNavigate: () => void) => {
  return (
    <Button
      key={item.id}
      asChild
      variant="neutral"
      className={styles.mobileNavButton}
    >
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
