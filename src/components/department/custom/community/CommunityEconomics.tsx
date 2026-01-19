import { Check } from 'lucide-react';

const comparisonData = [
  {
    dimension: 'Time to deploy',
    traditional: 'Months (recruiting + onboarding)',
    kartel: 'Weeks (pre-trained talent pool)',
    advantage: 'kartel',
  },
  {
    dimension: 'Acquisition cost',
    traditional: 'High (recruiters, agencies)',
    kartel: 'Low (community engagement)',
    advantage: 'kartel',
  },
  {
    dimension: 'Training investment',
    traditional: 'External courses + ramp time',
    kartel: 'Internal Discord programs',
    advantage: 'kartel',
  },
  {
    dimension: 'Scaling flexibility',
    traditional: 'Limited (linear hiring)',
    kartel: 'High (tiered pipeline)',
    advantage: 'kartel',
  },
];

export function CommunityEconomics() {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Community Economics
        </h2>
        <p className="text-gray-600">
          How the Kartel Talent Engine compares to traditional hiring approaches
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Dimension
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Traditional Hiring
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Kartel Talent Engine
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={row.dimension}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {row.dimension}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-b border-gray-200">
                    {row.traditional}
                  </td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      {row.advantage === 'kartel' && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                      <span className={row.advantage === 'kartel' ? 'font-semibold text-green-900' : 'text-gray-700'}>
                        {row.kartel}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Talent Moat Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          The Talent Moat Thesis
        </h3>
        <p className="text-sm text-gray-700 mb-2">
          The community isn't just a recruiting channel — it's a competitive advantage:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Attract:</strong> Discord culture and learning opportunities draw talent organically</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Train:</strong> Internal programs build Kartel-specific skills competitors can't replicate</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Filter:</strong> 5-tier progression ensures only proven contributors reach client work</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2 flex-shrink-0 font-bold">•</span>
            <span><strong>Deploy:</strong> Tier 5 talent delivers client value while maintaining community connection</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
