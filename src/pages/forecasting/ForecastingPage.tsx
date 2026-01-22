import { useState } from 'react';
import { TrendingUp, BarChart3, Target, Users } from 'lucide-react';
import { PlanVsActualTab } from './PlanVsActualTab';
import { WhatIfTab } from './WhatIfTab';
import { PipelineTab } from './PipelineTab';

type TabId = 'plan-vs-actual' | 'what-if' | 'pipeline';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof TrendingUp;
}

const TABS: Tab[] = [
  { id: 'plan-vs-actual', label: 'Plan vs Actual', icon: Target },
  { id: 'what-if', label: 'What-If', icon: BarChart3 },
  { id: 'pipeline', label: 'Pipeline', icon: Users },
];

export function ForecastingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('what-if');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Forecasting</h1>
          <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            2026
          </span>
        </div>
        <p className="text-indigo-100">
          Revenue planning and scenario modeling for board review
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'plan-vs-actual' && <PlanVsActualTab />}
          {activeTab === 'what-if' && <WhatIfTab />}
          {activeTab === 'pipeline' && <PipelineTab />}
        </div>
      </div>
    </div>
  );
}
