import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Building2,
  Users,
  User,
  Target,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const { user } = useAuth();

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
        { name: 'All Goals', href: '/goals', icon: Target },
      ],
    },
    { name: 'Update Progress', href: '/progress/update', icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">WhyGo</h1>
        <p className="text-sm text-gray-500 mt-1">Kartel AI</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
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
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-gray-200">
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
