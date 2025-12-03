'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const technologies = [
  {
    name: 'Strapi',
    href: 'https://strapi.io',
    logo: '/logos/Strapi.monogram.logo.svg',
    color: 'bg-[#4945FF]',
    description: 'The leading open-source headless CMS',
  },
  {
    name: 'TanStack Start',
    href: 'https://tanstack.com/start',
    logo: '/logos/logo-color-banner-600.png',
    color: 'bg-[#FF4154]',
    description: 'Full-stack React framework powered by TanStack Router',
  },
  {
    name: 'RetroUI',
    href: 'https://www.retroui.dev/',
    logo: '/logos/retroui.png',
    color: 'bg-[#C4A1FF]',
    description: 'Retro-styled UI components for React',
  },
]

export function BuiltWithBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 max-w-sm">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-md"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Built with
          </span>
        </div>

        {/* Tech logos */}
        <div className="flex items-center justify-center gap-4">
          {technologies.map((tech) => (
            <div key={tech.name} className="relative">
              <a
                href={tech.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 border-2 border-black rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1 bg-white"
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-10 h-10 object-contain"
                />
              </a>

              {/* Preview tooltip - positioned to stay on screen */}
              {hoveredTech === tech.name && (
                <div className="absolute bottom-full left-0 mb-3 w-56 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  {/* Header bar */}
                  <div className={`${tech.color} p-3 border-b-4 border-black`}>
                    <div className="flex items-center gap-2">
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="font-bold text-white text-sm">{tech.name}</span>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r-4 border-b-4 border-black rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-3 border-t-2 border-dashed border-black/20" />

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground">
          Hover for details, click to visit
        </p>
      </div>
    </div>
  )
}
