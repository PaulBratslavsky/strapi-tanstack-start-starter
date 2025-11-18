import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const styles = {
  button:
    'fixed bottom-8 right-8 z-50 size-12 rounded-full shadow-shadow border-2 border-border transition-all duration-300 ease-in-out',
  visible: 'opacity-100 translate-y-0',
  hidden: 'opacity-0 translate-y-16 pointer-events-none',
}

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
    <Button
      onClick={scrollToTop}
      size="icon"
      variant="default"
      className={`${styles.button} ${isVisible ? styles.visible : styles.hidden}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}
