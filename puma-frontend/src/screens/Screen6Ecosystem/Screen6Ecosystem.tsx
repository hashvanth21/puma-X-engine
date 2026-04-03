import { useNavigate } from 'react-router-dom';
import { PageWrapper, Button } from '@/components';
export default function Screen6Ecosystem() {
  const navigate = useNavigate();
  return (
    <PageWrapper className="pt-20 flex items-center justify-center min-h-screen">
      <div className="text-center glass-card p-12 max-w-md">
        <div className="text-5xl mb-4">🌐</div>
        <h2 className="font-display font-black text-3xl text-text-primary mb-2">Ecosystem Vision</h2>
        <p className="text-text-muted text-sm mb-6">Future expansion: apparel, loyalty, reminders — Phase 6</p>
        <Button size="sm" onClick={() => navigate('/')}>← Start Over</Button>
      </div>
    </PageWrapper>
  );
}
