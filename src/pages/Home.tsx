import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { BookOpen, Building2, Target, TrendingUp } from 'lucide-react';

export function Home() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Learn WhyGo Philosophy',
      description: 'Understand the framework before setting goals',
      icon: BookOpen,
      href: '/philosophy',
      color: 'bg-blue-500',
    },
    {
      title: 'View Company Goals',
      description: 'See all 4 company WhyGOs for 2026',
      icon: Building2,
      href: '/company',
      color: 'bg-green-500',
    },
    {
      title: 'Create Your Goals',
      description: 'Set up your individual WhyGOs',
      icon: Target,
      href: '/goals/new',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to WhyGo, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your goals and drive Kartel AI's mission forward
        </p>
      </div>

      {/* Strategic Context Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Why 2026 Matters</h2>
        <p className="text-lg mb-4">
          2026 is the year Kartel proves Creative Intelligence Infrastructure works for enterprise.
          We're validating market demand across 5 verticals, demonstrating operational excellence,
          building our talent engine, and deploying platform infrastructure that creates switching costs.
        </p>
        <p className="text-lg mb-4">
          <strong>What Winning Looks Like:</strong> By end of 2026, Kartel will be the proven Creative Intelligence Infrastructure
          partner for enterprise brands - with referenceable clients across five verticals, operational systems that scale,
          and a talent engine that compounds our capacity.
        </p>
        <Link
          to="/company"
          className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          View Full Strategic Context →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`${action.color} p-3 rounded-lg text-white`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Start with the Philosophy module to understand the WhyGo framework</li>
          <li>Review your department's WhyGOs to understand team priorities</li>
          <li>Create your individual WhyGOs aligned with department goals</li>
          <li>Update progress weekly/monthly to track your outcomes</li>
        </ol>
      </div>
    </div>
  );
}
