import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import {
  Home,
  BookOpen,
  Building2,
  Users,
  User,
  Target,
  PlusCircle,
  Code,
  X,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useDevMode } from '@/hooks/useDevMode';
import { DevModeContext } from '@/contexts/DevModeContext';
import type { EmployeeLevel } from '@/types/employee.types';

export function Sidebar() {
  const { user } = useDevMode();
  const { isDevMode, devLevelOverride, setDevLevelOverride, clearDevLevelOverride } = useContext(DevModeContext);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Philosophy', href: '/philosophy', icon: BookOpen },
    {
      name: 'Dashboards',
      items: [
        { name: 'Company', href: '/company', icon: Building2 },
        { name: 'My Department', href: `/department/${user?.department}`, icon: Users },
        { name: 'My Goals', href: '/my-goals', icon: User },
      ],
    },
    {
      name: 'Goals',
      items: [
        { name: 'Create Goal', href: '/goals/new', icon: PlusCircle },
        { name: 'All WhyGos - Q1', href: '/goals', icon: Target },
      ],
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">WhyGo</h1>
        <p className="text-sm text-gray-500 mt-1">Kartel AI</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.href ? (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.name}
                  </div>
                  <ul className="space-y-1 mt-1">
                    {item.items?.map((subItem) => (
                      <li key={subItem.name}>
                        <NavLink
                          to={subItem.href}
                          end
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          {subItem.icon && <subItem.icon className="w-5 h-5" />}
                          <span>{subItem.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}

          {/* Management Dashboard - Only for executives and department heads */}
          {(user?.level === 'executive' || user?.level === 'department_head') && (
            <li>
              <NavLink
                to="/management"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <BarChart3 className="w-5 h-5" />
                <span>Management Dashboard</span>
              </NavLink>
            </li>
          )}

          {/* Forecasting - Only for executives and department heads */}
          {(user?.level === 'executive' || user?.level === 'department_head') && (
            <li>
              <NavLink
                to="/forecasting"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <TrendingUp className="w-5 h-5" />
                <span>Forecasting</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {/* Dev Mode Controls - Hidden per user request */}
      {/* {isDevMode && (
        <div className="p-4 border-t border-gray-200 bg-yellow-50">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-yellow-700" />
            <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Dev Mode</span>
          </div>

          <div className="space-y-2">
            <div>
              <label htmlFor="levelOverride" className="block text-xs font-medium text-gray-700 mb-1">
                Level Override
              </label>
              <div className="flex gap-1">
                <select
                  id="levelOverride"
                  value={devLevelOverride || ''}
                  onChange={(e) => setDevLevelOverride(e.target.value as EmployeeLevel || null)}
                  className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="">No Override</option>
                  <option value="executive">Executive</option>
                  <option value="department_head">Department Head</option>
                  <option value="manager">Manager</option>
                  <option value="ic">IC</option>
                </select>
                {devLevelOverride && (
                  <button
                    onClick={clearDevLevelOverride}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                    title="Clear override"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
              {devLevelOverride && (
                <p className="text-xs text-yellow-700 mt-1">
                  Active: {devLevelOverride} {user && `(was ${user.level})`}
                </p>
              )}
            </div>
          </div>
        </div>
      )} */}

      {user && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
