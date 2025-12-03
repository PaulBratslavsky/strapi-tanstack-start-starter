import { Bell, Menu, MessageCircleIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { THeader } from '@/types'
import { Avatar } from "@/components/retroui/Avatar";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/retroui/Button";
import { StrapiImage } from "@/components/custom/strapi-image";
import { LogoutButton } from "@/components/custom/logout-button";
import { SmartLink } from "@/components/custom/smart-link";

interface NavigationUser {
  username: string
  email: string
  image?: {
    url: string
    alternativeText?: string | null
  }
}

interface ITopNavigationProps {
  header?: THeader
  currentUser?: NavigationUser | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function TopNavigation({ header, currentUser }: ITopNavigationProps) {
  const logoLabel = header?.logo.label || "SING";
  const logoHref = header?.logo.href || "/";
  const logoImage = header?.logo.image;
  const navItems = header?.navItems || [];
  const cta = header?.cta;

  const userDisplayName = currentUser?.username || "Guest";
  const userInitials = getInitials(userDisplayName);

  return (
    <nav className="bg-[#F9F5F2] border-y-3">
      <div className="container h-14 max-w-6xl mx-auto flex items-stretch justify-between px-4 xl:px-0">
        {/* Logo */}
        <Link to={logoHref} className="text-2xl font-head border-x-3 px-4 border-black flex items-center">
          {logoImage ? (
            <StrapiImage
              src={logoImage.url}
              alt={logoImage.alternativeText || logoLabel}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            logoLabel
          )}
        </Link>

        {/* Desktop Navigation Items */}
        {navItems.length > 0 && (
          <div className="hidden md:flex items-center gap-8 font-medium">
            {navItems.map((item) => (
              <SmartLink
                key={item.id}
                href={item.href}
                className="hover:underline underline-offset-4 decoration-primary decoration-2"
              >
                {item.label}
              </SmartLink>
            ))}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex">
          {/* Notifications - only show when logged in */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-3 px-4">
              <div className="relative cursor-pointer hover:opacity-80">
                <MessageCircleIcon className="h-5 w-5" />
              </div>
              <div className="relative cursor-pointer hover:opacity-80">
                <Bell className="h-5 w-5" />
                <span className="bg-[#C4A1FF] rounded-full h-2.5 w-2.5 border-2 border-[#F9F5F2] absolute -top-px -right-px"></span>
              </div>
            </div>
          )}

          <div className="flex items-stretch border-x-3 border-black">
            {currentUser ? (
              <>
                <Link
                  to="/"
                  className="flex items-center px-4 gap-2 font-medium bg-[#E7F193] hover:bg-[#d9e484] transition-colors"
                >
                  <Avatar className="h-9 w-9">
                    {currentUser.image ? (
                      <Avatar.Image>
                        <StrapiImage
                          src={currentUser.image.url}
                          alt={currentUser.image.alternativeText || userDisplayName}
                          className="h-full w-full object-cover rounded-full"
                        />
                      </Avatar.Image>
                    ) : (
                      <Avatar.Fallback>{userInitials}</Avatar.Fallback>
                    )}
                  </Avatar>
                  <span className="hidden md:inline">{userDisplayName}</span>
                </Link>
                <LogoutButton variant="full" />
              </>
            ) : (
              <>
                {cta && (
                  <SmartLink
                    href={cta.href}
                    className="flex items-center px-4 gap-2 font-medium bg-[#E7F193] hover:bg-[#d9e484] transition-colors"
                  >
                    {cta.label}
                  </SmartLink>
                )}
              </>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden border-l-3 border-black">
              <Drawer direction="left">
                <DrawerTrigger asChild>
                  <Button size="icon" className="bg-[#C4FF83] rounded-none h-full px-4 shadow-none border-none">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-[#F9F5F2] border-l-3 border-black h-full w-80 ml-auto flex flex-col">
                  <DrawerHeader className="border-b-3 border-black">
                    <DrawerTitle className="text-2xl font-head">
                      <DrawerClose asChild>
                        <Link to={logoHref}>
                          {logoImage ? (
                            <StrapiImage
                              src={logoImage.url}
                              alt={logoImage.alternativeText || logoLabel}
                              height={32}
                              className="h-8 w-auto"
                            />
                          ) : (
                            logoLabel
                          )}
                        </Link>
                      </DrawerClose>
                    </DrawerTitle>
                  </DrawerHeader>

                  <div className="flex-1 flex flex-col p-4 space-y-6">
                    {/* User Profile Section */}
                    {currentUser && (
                      <div className="flex items-center gap-3 p-4 bg-[#E7F193] border-3 border-black rounded-lg">
                        <Avatar className="h-12 w-12">
                          {currentUser.image ? (
                            <Avatar.Image>
                              <StrapiImage
                                src={currentUser.image.url}
                                alt={currentUser.image.alternativeText || userDisplayName}
                                className="h-full w-full object-cover rounded-full"
                              />
                            </Avatar.Image>
                          ) : (
                            <Avatar.Fallback>{userInitials}</Avatar.Fallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-lg">{userDisplayName}</p>
                          <p className="text-sm text-muted-foreground">Welcome back!</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Items */}
                    {navItems.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium text-lg">Navigation</h3>
                        {navItems.map((item) => (
                          <DrawerClose key={item.id} asChild>
                            <Button
                              asChild
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <SmartLink href={item.href}>
                                {item.label}
                              </SmartLink>
                            </Button>
                          </DrawerClose>
                        ))}
                      </div>
                    )}

                    {/* CTA for non-logged in users */}
                    {!currentUser && cta && (
                      <DrawerClose asChild>
                        <Button asChild className="w-full">
                          <SmartLink href={cta.href}>
                            {cta.label}
                          </SmartLink>
                        </Button>
                      </DrawerClose>
                    )}

                    {/* Notifications */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg">Notifications</h3>
                      <div className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-lg">
                        <MessageCircleIcon className="h-5 w-5" />
                        <span>Messages</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-lg">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                        <span className="bg-[#C4A1FF] rounded-full h-2.5 w-2.5 ml-auto"></span>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button - Sticky at bottom */}
                  {currentUser && (
                    <div className="border-t-3 border-black p-4">
                      <LogoutButton variant="mobile" />
                    </div>
                  )}
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

