import { useNavigate } from 'react-router-dom';
import { PageWrapper, Button } from '@/components';
export default function Screen4Match() {
  const navigate = useNavigate();
  return (
    <PageWrapper className="pt-20 flex items-center justify-center min-h-screen">
      <div className="text-center glass-card p-12 max-w-md">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="font-display font-black text-3xl text-text-primary mb-2">Match Result</h2>
        <p className="text-text-muted text-sm mb-6">AI-powered shoe match with explanation — Phase 5</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" size="sm" onClick={() => navigate('/questions')}>← Back</Button>
          <Button size="sm" onClick={() => navigate('/compare')}>Skip to Compare →</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
