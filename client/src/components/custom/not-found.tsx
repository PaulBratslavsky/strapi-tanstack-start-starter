import { Link } from '@tanstack/react-router';
import { Home, ArrowLeft, SearchX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const styles = {
  root: 'h-full flex items-center justify-center bg-white dark:bg-dark p-4',
  card: 'w-full max-w-2xl bg-background border-2 border-border shadow-shadow',
  cardContent: 'text-center space-y-8 p-8',
  iconWrapper: 'flex justify-center',
  icon: 'size-20 text-muted-foreground/40',
  headerWrap: 'space-y-3',
  code: 'text-7xl font-bold text-main',
  title: 'text-2xl font-bold text-foreground',
  message: 'text-muted-foreground text-base',
  actions: 'flex flex-col sm:flex-row gap-3 justify-center',
}

interface INotFoundProps {
  title: string
  message: string
}

export function NotFound({
  title = 'Page Not Found',
  message = "The page you're looking for doesn't exist or has been moved.",
}: Readonly<INotFoundProps>) {
  const handleBack = () => window.history.back()

  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <div className={styles.iconWrapper}>
            <SearchX className={styles.icon} />
          </div>

          <div className={styles.headerWrap}>
            <h1 className={styles.code}>404</h1>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>{message}</p>
          </div>

          <div className={styles.actions}>
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link to="/" aria-label="Go to homepage">
                <Home />
                <span>Go Home</span>
              </Link>
            </Button>

            <Button
              type="button"
              onClick={handleBack}
              variant="neutral"
              className="w-full sm:w-auto"
            >
              <ArrowLeft />
              <span>Go Back</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
