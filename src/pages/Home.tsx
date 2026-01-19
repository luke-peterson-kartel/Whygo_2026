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
    {
      title: 'Update Progress',
      description: 'Track your quarterly outcomes',
      icon: TrendingUp,
      href: '/progress/update',
      color: 'bg-orange-500',
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
