import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';

export const routes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-black text-gray-900">404</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">Route Not Found</p>
        <a href="/" className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 underline">
          Return to Dashboard Desk
        </a>
      </div>
    )
  }
];
