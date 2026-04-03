interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'muted';
  className?: string;
}

const variantClasses = {
  accent: 'bg-accent/20 text-accent border border-accent/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  muted: 'bg-bg-elevated text-text-muted border border-border-subtle',
};

export const Badge = ({ children, variant = 'accent', className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);
