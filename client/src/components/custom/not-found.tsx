import { Link } from '@tanstack/react-router'

const styles = {
  root: "min-h-screen flex items-center justify-center bg-background",
  container: "w-full max-w-md text-center",
  headerWrap: "mb-8",
  code: "text-6xl font-bold text-foreground mb-4",
  title: "text-2xl font-semibold text-foreground mb-2",
  message: "text-muted-foreground mb-8",
  actions: "space-y-4",
  homeLink:
    "block w-full rounded-lg px-6 py-3 bg-primary text-primary-foreground font-semibold transition-colors hover:bg-primary/90",
  backButton:
    "w-full rounded-lg px-6 py-3 border border-border text-foreground font-semibold transition-colors hover:bg-muted",
};

interface INotFoundProps {
  title: string
  message: string
}

export function NotFound({ title = "Page Not Found", message = "The page you're looking for doesn't exist or has been moved." }: Readonly<INotFoundProps>) {
  const handleBack = () => window.history.back();

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.headerWrap}>
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>
            {message}
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.homeLink} aria-label="Go to homepage">
            Go Home
          </Link>

          <button
            type="button"
            onClick={handleBack}
            className={styles.backButton}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
