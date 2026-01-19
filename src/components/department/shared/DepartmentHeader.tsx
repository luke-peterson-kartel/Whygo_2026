import React from 'react';
import { Building2 } from 'lucide-react';

interface DepartmentHeaderProps {
  name: string;
  head: string;
  status: string;
  mission: string;
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'teal';
}

const colorSchemes = {
  orange: {
    gradient: 'from-orange-600 to-amber-700',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  green: {
    gradient: 'from-green-600 to-emerald-700',
    badge: 'bg-green-100 text-green-800 border-green-300',
  },
  blue: {
    gradient: 'from-blue-600 to-indigo-700',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  purple: {
    gradient: 'from-purple-600 to-violet-700',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  teal: {
    gradient: 'from-teal-600 to-cyan-700',
    badge: 'bg-teal-100 text-teal-800 border-teal-300',
  },
};

export default function DepartmentHeader({
  name,
  head,
  status,
  mission,
  color = 'blue'
}: DepartmentHeaderProps) {
  const scheme = colorSchemes[color];

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${scheme.gradient} text-white rounded-lg shadow-lg p-8 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{name} Department</h1>
              <p className="text-white/90 mt-1">{head}</p>
            </div>
          </div>
          <div className={`${scheme.badge} px-4 py-2 rounded-full text-sm font-semibold border`}>
            {status}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Mission
        </h2>
        <p className="text-lg text-gray-900 leading-relaxed">
          {mission}
        </p>
      </div>
    </div>
  );
}
