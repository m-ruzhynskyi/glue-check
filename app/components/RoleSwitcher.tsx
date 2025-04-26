'use client';

interface RoleSwitcherProps {
  currentRole: 'consultant' | 'cashier';
  onRoleChange: (role: 'consultant' | 'cashier') => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
          currentRole === 'consultant'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onRoleChange('consultant')}
      >
        Consultant
      </button>
      <button
        type="button"
        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
          currentRole === 'cashier'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => onRoleChange('cashier')}
      >
        Cashier
      </button>
    </div>
  );
}