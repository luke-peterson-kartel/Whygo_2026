import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { AppLayout } from '@/components/layout/AppLayout';
import DepartmentHeader from '@/components/department/shared/DepartmentHeader';
import ExecutiveSummary from '@/components/department/shared/ExecutiveSummary';
import FourHandoffCycle from '@/components/department/custom/production/FourHandoffCycle';
import PodStructure from '@/components/department/custom/production/PodStructure';
import ProgressIndicators from '@/components/department/custom/production/ProgressIndicators';
import { WhyGOCard } from '@/components/whygo/WhyGOCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { WhyGOWithOutcomes } from '@/types/whygo.types';
import { getDepartmentQueryValue } from '@/lib/departmentUtils';

export default function ProductionView() {
  const [whygos, setWhygos] = useState<WhyGOWithOutcomes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductionWhyGOs();
  }, []);

  const loadProductionWhyGOs = async () => {
    try {
      // Query WhyGOs for Production department
      const whygosQuery = query(
        collection(db, 'whygos'),
        where('level', '==', 'department'),
        where('department', '==', getDepartmentQueryValue('production')),
        where('year', '==', 2026),
        where('status', 'in', ['draft', 'active']),
        orderBy('createdAt', 'asc')
      );

      const whygosSnapshot = await getDocs(whygosQuery);
      const whygosData: WhyGOWithOutcomes[] = [];

      for (const doc of whygosSnapshot.docs) {
        const whygoData = { id: doc.id, ...doc.data() } as WhyGOWithOutcomes;

        // Load outcomes for this WhyGO
        const outcomesQuery = query(
          collection(db, 'whygos', doc.id, 'outcomes'),
          orderBy('sortOrder', 'asc')
        );
        const outcomesSnapshot = await getDocs(outcomesQuery);
        whygoData.outcomes = outcomesSnapshot.docs.map(outcomeDoc => ({
          id: outcomeDoc.id,
          ...outcomeDoc.data(),
        })) as any[];

        whygosData.push(whygoData);
      }

      setWhygos(whygosData);
    } catch (error) {
      console.error('Error loading Production WhyGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState message="Loading Production WhyGOs..." minHeight="h-64" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Header */}
        <DepartmentHeader
          name="Production"
          head="Wayan Palmieri, SVP Head of Production"
          status="APPROVED - Ready for Team Cascade"
          mission="Production is the proof layer. Sales can promise. Platform can exist. Generative can build. But Production is where clients experience the company."
          color="orange"
        />

        {/* Executive Summary */}
        <ExecutiveSummary
          priorities={[
            'Scale Through Disciplined Handoffs: Establish platform-tracked handoff systems across Sales→Production→Generative→Sales that scale from 6 to 20 active client engagements.',
            'Deliver Premier Client Experience: Achieve 50% production margin, 90%+ on-time delivery against workflow SLAs, and growing client platform engagement.',
            'Scale Production Capacity With Revenue: Add Producers proportional to revenue growth while discovering the sustainable client-to-producer ratio (target 4:1).',
          ]}
          alignment="These WhyGOs ladder directly to Company WhyGOs #1 (Product-Market Fit), #2 (Operational Excellence), and #4 (Enterprise Platform). Production exists to scale Kartel from a high-touch boutique operation to an enterprise-grade delivery engine without breaking quality, margin, or trust."
          dependencies="Success depends on coordination with Sales (deal handoffs), Generative (QC-passed assets), and Platform (Production Management tools)."
          color="orange"
        />

        {/* Four Handoff Cycle - Production's Signature Framework */}
        <FourHandoffCycle />

        {/* WhyGOs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2026 WhyGOs</h2>
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
        </div>

        {/* Pod Structure */}
        <PodStructure />

        {/* Progress Indicators */}
        <ProgressIndicators />
      </div>
    </AppLayout>
  );
}
