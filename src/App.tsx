import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export function App() {
  return (
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

            {/* Dashboard routes - placeholders */}
            <Route path="/company" element={<PlaceholderPage title="Company Dashboard" />} />
            <Route path="/department/:dept" element={<PlaceholderPage title="Department Dashboard" />} />
            <Route path="/my-goals" element={<PlaceholderPage title="My Goals" />} />

            {/* Goal routes - placeholders */}
            <Route path="/goals" element={<PlaceholderPage title="All Goals" />} />
            <Route path="/goals/new" element={<PlaceholderPage title="Create Goal" />} />
            <Route path="/goals/:id" element={<PlaceholderPage title="Goal Detail" />} />
            <Route path="/goals/:id/edit" element={<PlaceholderPage title="Edit Goal" />} />

            {/* Progress routes - placeholders */}
            <Route path="/progress/update" element={<PlaceholderPage title="Update Progress" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
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
