import { useState } from 'react';
import { Plus, Building2, Pencil, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/forecastCalculations';
import { STAGE_CONFIG } from '@/types/forecasting.types';
import type { PipelineDeal, DealStage } from '@/types/forecasting.types';
import { usePipelineDeals } from '@/hooks/usePipelineDeals';
import { useSalesConfig } from '@/hooks/useSalesConfig';
import { DealFormModal } from '@/components/forecasting/DealFormModal';

type StageFilter = DealStage | 'all';

export function PipelineTab() {
  const { deals, loading: dealsLoading, error: dealsError, addDeal, updateDeal, deleteDeal } = usePipelineDeals();
  const { eoyRevenueTarget, loading: configLoading } = useSalesConfig(2026);
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<PipelineDeal | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);

  // Revenue target from centralized config (single source of truth)
  const revenueTarget = eoyRevenueTarget;
  const loading = dealsLoading || configLoading;
  const error = dealsError;

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

  // Handlers
  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal: PipelineDeal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    setDeletingDealId(dealId);
    try {
      await deleteDeal(dealId);
    } catch (err) {
      console.error('Error deleting deal:', err);
      alert('Failed to delete deal');
    } finally {
      setDeletingDealId(null);
    }
  };

  const handleSaveDeal = async (dealData: Omit<PipelineDeal, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    if (editingDeal) {
      // Update existing deal
      await updateDeal(editingDeal.id, dealData);
    } else {
      // Add new deal
      await addDeal(dealData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          <p className="text-3xl font-bold text-gray-900">{weightedPipeline > 0 && revenueTarget > 0 ? ((weightedPipeline / revenueTarget) * 100).toFixed(1) : '0.0'}%</p>
          <p className="text-xs text-gray-400 mt-1">vs {formatCurrency(revenueTarget)} target</p>
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
            onClick={handleAddDeal}
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
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeals.map((deal) => {
                const acv = deal.monthlyFee * 12;
                const weighted = acv * deal.probability / 100;
                const stageConfig = STAGE_CONFIG[deal.stage];
                const isDeleting = deletingDealId === deal.id;
                return (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{deal.companyName}</p>
                          <p className="text-sm text-gray-500">{deal.contactName || '—'}</p>
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
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditDeal(deal)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit deal"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          disabled={isDeleting}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete deal"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDeals.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {deals.length === 0 ? (
              <div>
                <p className="mb-2">No deals in your pipeline yet</p>
                <button
                  onClick={handleAddDeal}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Add your first deal
                </button>
              </div>
            ) : (
              'No deals match the current filter'
            )}
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

      {/* Deal Form Modal */}
      <DealFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
    </div>
  );
}
