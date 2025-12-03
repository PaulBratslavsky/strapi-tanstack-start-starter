'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

// Inline SVG logos
function StrapiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M256 128C256 198.692 198.692 256 128 256C57.3076 256 0 198.692 0 128C0 57.3076 57.3076 0 128 0C198.692 0 256 57.3076 256 128Z" fill="#4945FF"/>
      <path d="M88 88V136H136V184H184V88H88Z" fill="white"/>
      <path d="M88 136H136V184L88 136Z" fill="#9593FF"/>
      <path d="M136 88V136H184L136 88Z" fill="#9593FF"/>
    </svg>
  )
}

function TanStackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="128" fill="#23272F"/>
      <path d="M64 96L128 64L192 96V160L128 192L64 160V96Z" fill="#FF4154"/>
      <path d="M128 64L192 96L128 128L64 96L128 64Z" fill="#FF6B7A"/>
      <path d="M128 128V192L64 160V96L128 128Z" fill="#CC3344"/>
      <path d="M128 128L192 96V160L128 192V128Z" fill="#FF4154"/>
    </svg>
  )
}

function RetroUILogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" rx="32" fill="#C4A1FF"/>
      <rect x="48" y="48" width="160" height="160" rx="8" fill="white" stroke="black" strokeWidth="8"/>
      <rect x="72" y="72" width="48" height="48" fill="#E7F193" stroke="black" strokeWidth="4"/>
      <rect x="136" y="72" width="48" height="48" fill="#FFB3BA" stroke="black" strokeWidth="4"/>
      <rect x="72" y="136" width="112" height="48" fill="#A1D4FF" stroke="black" strokeWidth="4"/>
    </svg>
  )
}

const technologies = [
  {
    name: 'Strapi',
    href: 'https://strapi.io',
    Logo: StrapiLogo,
    color: 'bg-[#4945FF]',
    description: 'The leading open-source headless CMS',
  },
  {
    name: 'TanStack Start',
    href: 'https://tanstack.com/start',
    Logo: TanStackLogo,
    color: 'bg-[#FF4154]',
    description: 'Full-stack React framework powered by TanStack Router',
  },
  {
    name: 'RetroUI',
    href: 'https://www.retroui.dev/',
    Logo: RetroUILogo,
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
                <tech.Logo className="w-10 h-10" />
              </a>

              {/* Preview tooltip - positioned to stay on screen */}
              {hoveredTech === tech.name && (
                <div className="absolute bottom-full left-0 mb-3 w-56 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  {/* Header bar */}
                  <div className={`${tech.color} p-3 border-b-4 border-black`}>
                    <div className="flex items-center gap-2">
                      <tech.Logo className="w-6 h-6" />
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
