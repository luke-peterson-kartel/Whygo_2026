import { useState } from 'react';
import { Plus, MoreHorizontal, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/forecastCalculations';
import { STAGE_CONFIG } from '@/types/forecasting.types';
import type { PipelineDeal, DealStage } from '@/types/forecasting.types';

// Placeholder data - will be replaced with Firebase data in Phase 4
const PLACEHOLDER_DEALS: Omit<PipelineDeal, 'createdBy' | 'createdAt' | 'updatedAt'>[] = [
  { id: '1', companyName: 'Horizon Media', contactName: 'Jane Smith', stage: 'decision', probability: 60, monthlyFee: 100000, specSignedDate: null, expectedConversionDate: null, notes: '' },
  { id: '2', companyName: 'Newell / Bubba', contactName: 'Bob Wilson', stage: 'in_spec', probability: 50, monthlyFee: 75000, specSignedDate: null, expectedConversionDate: null, notes: '' },
  { id: '3', companyName: 'Marc Jacobs', contactName: 'Alice Brown', stage: 'spec_signed', probability: 40, monthlyFee: 66667, specSignedDate: null, expectedConversionDate: null, notes: '' },
  { id: '4', companyName: 'Saatchi / Toyota', contactName: 'Tom Davis', stage: 'prospect', probability: 25, monthlyFee: 83333, specSignedDate: null, expectedConversionDate: null, notes: '' },
  { id: '5', companyName: 'Amazon', contactName: 'Sarah Lee', stage: 'prospect', probability: 10, monthlyFee: 125000, specSignedDate: null, expectedConversionDate: null, notes: '' },
];

type StageFilter = DealStage | 'all';

export function PipelineTab() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const deals = PLACEHOLDER_DEALS;

  // Filter deals
  const filteredDeals = stageFilter === 'all'
    ? deals.filter(d => d.stage !== 'lost')
    : deals.filter(d => d.stage === stageFilter);

  // Calculate totals
  const totalPipeline = deals
    .filter(d => d.stage !== 'lost' && d.stage !== 'converted')
    .reduce((sum, d) => sum + d.monthlyFee * 12, 0);

  const weightedPipeline = deals
    .filter(d => d.stage !== 'lost')
    .reduce((sum, d) => sum + (d.monthlyFee * 12 * d.probability / 100), 0);

  // Count by stage
  const stageCounts = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<DealStage, number>);

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Total Pipeline (ACV)</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-gray-400 mt-1">{deals.filter(d => d.stage !== 'lost' && d.stage !== 'converted').length} active deals</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Weighted Pipeline</p>
          <p className="text-3xl font-bold text-indigo-600">{formatCurrency(weightedPipeline)}</p>
          <p className="text-xs text-gray-400 mt-1">Probability-adjusted value</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-1">Pipeline Coverage</p>
          <p className="text-3xl font-bold text-gray-900">{(totalPipeline / 7000000).toFixed(1)}x</p>
          <p className="text-xs text-gray-400 mt-1">vs $7M target</p>
        </div>
      </div>

      {/* Stage Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStageFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            stageFilter === 'all'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({deals.filter(d => d.stage !== 'lost').length})
        </button>
        {(['prospect', 'spec_signed', 'in_spec', 'decision', 'converted'] as DealStage[]).map((stage) => {
          const config = STAGE_CONFIG[stage];
          const count = stageCounts[stage] || 0;
          return (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                stageFilter === stage
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Deals Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Deals</h3>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            onClick={() => {/* TODO: Add deal modal */}}
          >
            <Plus className="w-4 h-4" />
            Add Deal
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monthly
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ACV
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Prob
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Weighted
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">

                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => {
                const acv = deal.monthlyFee * 12;
                const weighted = acv * deal.probability / 100;
                const stageConfig = STAGE_CONFIG[deal.stage];
                return (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{deal.companyName}</p>
                          <p className="text-sm text-gray-500">{deal.contactName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${stageConfig.color}-100 text-${stageConfig.color}-800`}>
                        {stageConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-900">
                      {formatCurrency(deal.monthlyFee)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(acv)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                      {deal.probability}%
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium text-indigo-600">
                      {formatCurrency(weighted)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDeals.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No deals match the current filter
          </div>
        )}
      </div>

      {/* Stage Funnel Visual */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline by Stage</h3>
        <div className="flex items-center justify-between gap-2">
          {(['prospect', 'spec_signed', 'in_spec', 'decision', 'converted'] as DealStage[]).map((stage, index) => {
            const config = STAGE_CONFIG[stage];
            const count = stageCounts[stage] || 0;
            const isLast = index === 4;
            return (
              <div key={stage} className="flex items-center flex-1">
                <div className={`flex-1 text-center p-4 rounded-lg bg-${config.color}-50 border border-${config.color}-200`}>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600">{config.label}</p>
                </div>
                {!isLast && (
                  <div className="px-2 text-gray-300">→</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Source Note */}
      <p className="text-xs text-gray-400 text-center">
        Pipeline data will be persisted to Firebase in Phase 4
      </p>
    </div>
  );
}
