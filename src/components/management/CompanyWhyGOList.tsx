import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { WhyGOSummaryCard } from './WhyGOSummaryCard';
import { getCompanyWhyGOs } from '@/lib/utils/managementStats';
import { Building2 } from 'lucide-react';

interface CompanyWhyGOListProps {
  whygos: WhyGOWithOutcomes[];
}

export function CompanyWhyGOList({ whygos }: CompanyWhyGOListProps) {
  const companyWhyGOs = getCompanyWhyGOs(whygos);

  if (companyWhyGOs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company WhyGO Performance (Q1)
        </h2>
        <p className="text-gray-600 text-center py-4">No company-level goals found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Company WhyGO Performance (Q1)
      </h2>
      <div className="space-y-3">
        {companyWhyGOs.map((whygo) => (
          <WhyGOSummaryCard key={whygo.id} whygo={whygo} />
        ))}
      </div>
    </div>
  );
}
