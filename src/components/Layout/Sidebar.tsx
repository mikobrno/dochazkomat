import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  BarChart3, 
  FolderOpen,
  Settings,
  Book,
  Heart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { name: 'Můj přehled', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'employee'] },
  { name: 'Přidat záznam', href: '/add-entry', icon: Clock, roles: ['employee'] },
  { name: 'Historie', href: '/time-history', icon: Book, roles: ['employee'] },
  { name: 'Reporty a přehledy', href: '/reports', icon: BarChart3, roles: ['admin'] },
  { name: 'Správa zaměstnanců', href: '/employees', icon: Users, roles: ['admin'] },
  { name: 'Správa projektů', href: '/projects', icon: FolderOpen, roles: ['admin'] },
  { name: 'Nastavení', href: '/settings', icon: Settings, roles: ['admin'] },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredItems = navItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-600 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Agent pac</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Docházkový systém</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-r-2 border-amber-600'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};