import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { Building2, TrendingUp } from 'lucide-react';

export function CompanyView() {
  const [whygos, setWhygos] = useState<WhyGOWithOutcomes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyWhyGOs();
  }, []);

  async function loadCompanyWhyGOs() {
    try {
      setLoading(true);
      setError(null);

      // Query company-level WhyGOs for 2026
      const whygosRef = collection(db, 'whygos');
      const q = query(
        whygosRef,
        where('level', '==', 'company'),
        where('year', '==', 2026),
        where('status', 'in', ['draft', 'active'])
      );

      const querySnapshot = await getDocs(q);
      const loadedWhyGOs: WhyGOWithOutcomes[] = [];

      for (const doc of querySnapshot.docs) {
        const whygoData = { id: doc.id, ...doc.data() } as WhyGOWithOutcomes;

        // Load outcomes subcollection
        const outcomesRef = collection(db, 'whygos', doc.id, 'outcomes');
        const outcomesSnapshot = await getDocs(outcomesRef);

        whygoData.outcomes = outcomesSnapshot.docs.map(outcomeDoc => ({
          id: outcomeDoc.id,
          ...outcomeDoc.data(),
        })) as any[];

        // Sort outcomes by sortOrder
        whygoData.outcomes.sort((a, b) => a.sortOrder - b.sortOrder);

        loadedWhyGOs.push(whygoData);
      }

      setWhygos(loadedWhyGOs);
    } catch (err) {
      console.error('Error loading company WhyGOs:', err);
      setError('Failed to load company goals. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadCompanyWhyGOs}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company WhyGOs</h1>
            <p className="text-gray-600 mt-1">
              Kartel AI's 2026 Strategic Goals
            </p>
          </div>
        </div>
      </div>

      {/* Context Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Strategic Context</h2>
        <p className="text-gray-700 mb-4">
          2026 is the year Kartel proves the Creative Intelligence Infrastructure thesis. Our four company WhyGOs are designed to validate market demand, demonstrate operational maturity, build our talent engine, and deploy enterprise platform infrastructure.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">What Winning Looks Like</h3>
            </div>
            <p className="text-sm text-gray-700">
              By end of 2026, Kartel will be the proven Creative Intelligence Infrastructure partner for enterprise brands - with referenceable clients across five verticals, operational systems that scale, and a talent engine that compounds our capacity.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">The 70% Problem</h3>
            </div>
            <p className="text-sm text-gray-700">
              Generic AI tools deliver ~70% brand accuracy. Enterprise clients require 100%. Kartel solves this with custom LoRA models, air-gapped infrastructure, and brand-specific creative intelligence that compounds over time.
            </p>
          </div>
        </div>
      </div>

      {/* WhyGOs */}
      {whygos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Company Goals Yet</h3>
          <p className="text-gray-600">
            Company WhyGOs will appear here once they've been migrated from markdown files.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {whygos.map((whygo, index) => (
            <WhyGOCard
              key={whygo.id}
              whygo={whygo}
              number={index + 1}
              showOwner={true}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      {whygos.length > 0 && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Status Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 font-mono font-semibold rounded">[+]</span>
              <span className="text-gray-700">On pace (≥100% of quarterly target)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 font-mono font-semibold rounded">[~]</span>
              <span className="text-gray-700">Slightly off (80-99% of target)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 font-mono font-semibold rounded">[-]</span>
              <span className="text-gray-700">Off pace (&lt;80% of target)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
