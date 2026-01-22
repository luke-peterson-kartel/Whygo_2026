import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { PhilosophyIndex } from '@/pages/philosophy/PhilosophyIndex';
import { Step1_SimpleExplanation } from '@/pages/philosophy/Step1_SimpleExplanation';
import { Step2_ConfusionCheck } from '@/pages/philosophy/Step2_ConfusionCheck';
import { Step3_RefinementCycles } from '@/pages/philosophy/Step3_RefinementCycles';
import { Step4_UnderstandingChallenge } from '@/pages/philosophy/Step4_UnderstandingChallenge';
import { Step5_TeachingSnapshot } from '@/pages/philosophy/Step5_TeachingSnapshot';
import { CompanyView } from '@/pages/dashboards/CompanyView';
import { AllGoalsView } from '@/pages/dashboards/AllGoalsView';
import { DepartmentView } from '@/pages/dashboards/DepartmentView';
import { MyGoalsView } from '@/pages/dashboards/MyGoalsView';
import { ManagementDashboard } from '@/pages/dashboards/ManagementDashboard';
import { CreateGoalPage } from '@/pages/CreateGoalPage';
import { WhyGODetailPage } from '@/pages/WhyGODetailPage';
import { DEPARTMENT_CONFIGS } from '@/lib/departmentConfig';
import { DevModeProvider } from '@/contexts/DevModeContext';

export function App() {
  return (
    <DevModeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />

            {/* Philosophy Module */}
            <Route path="/philosophy" element={<PhilosophyIndex />} />
            <Route path="/philosophy/step1" element={<Step1_SimpleExplanation />} />
            <Route path="/philosophy/step2" element={<Step2_ConfusionCheck />} />
            <Route path="/philosophy/step3" element={<Step3_RefinementCycles />} />
            <Route path="/philosophy/step4" element={<Step4_UnderstandingChallenge />} />
            <Route path="/philosophy/step5" element={<Step5_TeachingSnapshot />} />

            {/* Dashboard routes */}
            <Route path="/company" element={<CompanyView />} />
            <Route path="/management" element={<ManagementDashboard />} />
            <Route path="/department/:dept" element={<DepartmentRouter />} />
            <Route path="/my-goals" element={<MyGoalsView />} />

            {/* Goal routes */}
            <Route path="/goals" element={<AllGoalsView />} />
            <Route path="/goals/new" element={<CreateGoalPage />} />
            <Route path="/goals/:id" element={<WhyGODetailPage />} />
            <Route path="/goals/:id/edit" element={<PlaceholderPage title="Edit Goal" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </DevModeProvider>
  );
}

// Department router component
function DepartmentRouter() {
  const { dept } = useParams<{ dept: string }>();
  const config = dept ? DEPARTMENT_CONFIGS[dept.toLowerCase()] : null;

  if (!config) {
    return <PlaceholderPage title={`${dept ? dept.charAt(0).toUpperCase() + dept.slice(1) : 'Department'} Dashboard`} />;
  }

  return (
    <DepartmentView
      department={config.name}
      customSections={config.customSections ? <config.customSections /> : undefined}
    />
  );
}

// Temporary placeholder component
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction and will be implemented in the next phase.</p>
    </div>
  );
}
