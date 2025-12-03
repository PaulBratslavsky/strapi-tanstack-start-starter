import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const mainContent = document.getElementById('main-content')
    if (!mainContent) return

    const toggleVisibility = () => {
      if (mainContent.scrollTop > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    mainContent.addEventListener('scroll', toggleVisibility)

    return () => {
      mainContent.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        w-12 h-12 rounded-full
        bg-white border-4 border-black
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-black" />
    </button>
  )
}
