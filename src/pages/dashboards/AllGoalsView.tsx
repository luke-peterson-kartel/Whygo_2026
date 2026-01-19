import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { Target } from 'lucide-react';
import { StrategicContext } from '@/components/whygo/StrategicContext';
import { DependenciesSection } from '@/components/dependencies/DependenciesSection';
import { DepartmentSection } from '@/components/whygo/DepartmentSection';
import { StatusLegend } from '@/components/whygo/StatusLegend';
import { getDepartmentColor } from '@/lib/departmentColors';

interface OrganizedWhyGOs {
  company: WhyGOWithOutcomes[];
  sales: WhyGOWithOutcomes[];
  production: WhyGOWithOutcomes[];
  generative: WhyGOWithOutcomes[];
  platform: WhyGOWithOutcomes[];
  community: WhyGOWithOutcomes[];
}

export function AllGoalsView() {
  const [organized, setOrganized] = useState<OrganizedWhyGOs>({
    company: [],
    sales: [],
    production: [],
    generative: [],
    platform: [],
    community: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAllWhyGOs();
  }, []);

  async function loadAllWhyGOs() {
    try {
      setLoading(true);
      setError(null);

      // Query ALL WhyGOs for 2026 (company + department)
      const whygosRef = collection(db, 'whygos');
      const q = query(
        whygosRef,
        where('year', '==', 2026),
        where('status', 'in', ['draft', 'active'])
      );

      const querySnapshot = await getDocs(q);
      const loadedWhyGOs: WhyGOWithOutcomes[] = [];

      // Load WhyGOs with outcomes
      for (const doc of querySnapshot.docs) {
        const whygoData = { id: doc.id, ...doc.data() } as WhyGOWithOutcomes;

        // Load outcomes subcollection
        const outcomesRef = collection(db, 'whygos', doc.id, 'outcomes');
        const outcomesSnapshot = await getDocs(outcomesRef);

        whygoData.outcomes = outcomesSnapshot.docs.map(outcomeDoc => ({
          id: outcomeDoc.id,
          ...outcomeDoc.data(),
        })) as any[];

        whygoData.outcomes.sort((a, b) => a.sortOrder - b.sortOrder);
        loadedWhyGOs.push(whygoData);
      }

      // Organize by level and department
      const organizedData = organizeWhyGOsByDepartment(loadedWhyGOs);
      setOrganized(organizedData);
    } catch (err) {
      console.error('Error loading WhyGOs:', err);
      setError('Failed to load goals. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function organizeWhyGOsByDepartment(whygos: WhyGOWithOutcomes[]): OrganizedWhyGOs {
    const company = whygos.filter(w => w.level === 'company');
    const sales = whygos.filter(w => w.level === 'department' && w.department === 'Sales');
    const production = whygos.filter(w => w.level === 'department' && w.department === 'Production');
    const generative = whygos.filter(w => w.level === 'department' && w.department === 'Generative');
    const platform = whygos.filter(w => w.level === 'department' && w.department === 'Platform');
    const community = whygos.filter(w => w.level === 'department' && w.department === 'Community');

    // Sort company WhyGOs by display order
    const goalOrder = [
      'Onboard 10 enterprise clients',
      'Establish operational infrastructure',
      'Deploy the three-pillar',
      'Build Discord community'
    ];

    company.sort((a, b) => {
      const aIndex = goalOrder.findIndex(prefix => a.goal?.startsWith(prefix));
      const bIndex = goalOrder.findIndex(prefix => b.goal?.startsWith(prefix));
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    return { company, sales, production, generative, platform, community };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={loadAllWhyGOs}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalWhyGOs = organized.company.length + organized.sales.length + organized.production.length +
                      organized.generative.length + organized.platform.length + organized.community.length;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Goals</h1>
            <p className="text-gray-600 mt-1">
              2026 Strategic Alignment - Company & All Department Goals
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Context */}
      <StrategicContext />

      {/* Dependencies Section */}
      <DependenciesSection />

      {/* ALL SECTIONS - Collapsible by Department */}
      {totalWhyGOs === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600">
            WhyGOs will appear here once they've been migrated from markdown files.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Section */}
          {organized.company.length > 0 && (
            <DepartmentSection
              department="Company"
              whygos={organized.company}
              colorScheme="from-blue-600 to-purple-600"
              defaultExpanded={true}
            />
          )}

          {/* Sales Section */}
          {organized.sales.length > 0 && (
            <DepartmentSection
              department="Sales"
              whygos={organized.sales}
              colorScheme={getDepartmentColor('Sales')}
            />
          )}

          {/* Production Section */}
          {organized.production.length > 0 && (
            <DepartmentSection
              department="Production"
              whygos={organized.production}
              colorScheme={getDepartmentColor('Production')}
            />
          )}

          {/* Generative Section */}
          {organized.generative.length > 0 && (
            <DepartmentSection
              department="Generative"
              whygos={organized.generative}
              colorScheme={getDepartmentColor('Generative')}
            />
          )}

          {/* Platform Section */}
          {organized.platform.length > 0 && (
            <DepartmentSection
              department="Platform"
              whygos={organized.platform}
              colorScheme={getDepartmentColor('Platform')}
            />
          )}

          {/* Community Section */}
          {organized.community.length > 0 && (
            <DepartmentSection
              department="Community"
              whygos={organized.community}
              colorScheme={getDepartmentColor('Community')}
            />
          )}
        </div>
      )}

      {/* Status Legend */}
      {totalWhyGOs > 0 && <StatusLegend />}
    </div>
  );
}
