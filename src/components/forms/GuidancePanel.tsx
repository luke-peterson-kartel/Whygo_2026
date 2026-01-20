import { Info } from 'lucide-react';

interface GuidancePanelProps {
  title: string;
  tips: string[];
  variant?: 'info' | 'success' | 'warning';
}

export function GuidancePanel({ title, tips, variant = 'info' }: GuidancePanelProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: 'text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
    },
  }[variant];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Info className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        <div>
          <h4 className={`font-semibold ${styles.text} mb-2`}>{title}</h4>
          <ul className={`text-sm ${styles.text} space-y-1`}>
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 bg-current rounded-full flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
