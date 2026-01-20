import { useState } from 'react';
import { ChevronDown, ChevronRight, User, Briefcase, Users } from 'lucide-react';
import { EmployeeRoleReference } from '@/hooks/useEmployeeRoleReference';

interface RoleContextSectionProps {
  roleReference: EmployeeRoleReference;
}

export function RoleContextSection({ roleReference }: RoleContextSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left mb-3 group"
      >
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Your Role</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 text-sm">
          {/* Title */}
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Title</p>
              <p className="font-medium text-gray-900">{roleReference.title}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Department</p>
              <p className="font-medium text-gray-900">{roleReference.department}</p>
            </div>
          </div>

          {/* Reports To */}
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Reports To</p>
              <p className="font-medium text-gray-900">{roleReference.reportsTo}</p>
            </div>
          </div>

          {/* Job Description */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Job Description</p>
            <p className="text-gray-700 leading-relaxed">{roleReference.jobDescription}</p>
          </div>

          {/* Core Responsibilities */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Core Responsibilities</p>
            <ul className="space-y-1.5">
              {roleReference.coreResponsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
