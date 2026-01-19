import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />

            {/* Philosophy Module - placeholder routes */}
            <Route path="/philosophy" element={<PlaceholderPage title="Philosophy" />} />

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
