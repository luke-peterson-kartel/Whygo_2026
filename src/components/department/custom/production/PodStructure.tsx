import React from 'react';
import { UserCheck, Briefcase, Sparkles } from 'lucide-react';

const podRoles = [
  {
    role: 'Account Manager',
    department: 'Sales',
    responsibility: 'Client relationship, renewals, upsells, NPS collection',
    icon: UserCheck,
    color: 'green',
  },
  {
    role: 'Producer',
    department: 'Production',
    responsibility: 'Execution management, handoffs, delivery, closing reports',
    icon: Briefcase,
    color: 'orange',
  },
  {
    role: 'Generative Pod',
    department: 'Generative',
    responsibility: 'Workflow Engineer, AI Generalist, Preditor, Data/LoRA Specialist',
    icon: Sparkles,
    color: 'purple',
  },
];

const colorClasses = {
  green: 'bg-green-100 text-green-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
};

export default function PodStructure() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pod Structure
        </h2>
        <p className="text-gray-600">
          Each client pod consists of cross-functional roles working in sync
        </p>
      </div>

      {/* Pod Roles Table */}
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Responsibility
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {podRoles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses[role.color as keyof typeof colorClasses]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {role.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[role.color as keyof typeof colorClasses]}`}>
                        {role.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {role.responsibility}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hiring Trigger Info */}
      <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-orange-900 mb-2">Hiring Trigger</h3>
        <p className="text-sm text-orange-900 mb-2">New Producer hired when:</p>
        <ul className="space-y-1">
          <li className="flex items-start text-sm text-orange-900">
            <span className="mr-2">•</span>
            <span>Revenue supports the role (margin positive)</span>
          </li>
          <li className="flex items-start text-sm text-orange-900">
            <span className="mr-2">•</span>
            <span>Existing Producers exceed sustainable ratio</span>
          </li>
          <li className="flex items-start text-sm text-orange-900">
            <span className="mr-2">•</span>
            <span>Client growth pipeline is confirmed</span>
          </li>
        </ul>
        <p className="text-sm text-orange-900 mt-3">
          <strong>Target client-to-producer ratio: 4:1</strong> (to be discovered through 2026)
        </p>
      </div>
    </div>
  );
}
