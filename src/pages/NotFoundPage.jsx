import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-4">
      <p className="text-6xl font-display font-bold text-primary">404</p>
      <h1 className="text-xl font-display font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <Button asChild><Link to="/">Back to Dashboard</Link></Button>
    </div>
  );
}
