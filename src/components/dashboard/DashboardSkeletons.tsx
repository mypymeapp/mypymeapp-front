// src/components/dashboard/DashboardSkeletons.tsx
import { Card } from 'flowbite-react';

export const DashboardSkeletons = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
    {/* KPI Skeletons */}
    <Card className="lg:col-span-1 p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </Card>
    <Card className="lg:col-span-1 p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </Card>
    <Card className="lg:col-span-1 p-4">
      {/* Placeholder for a third KPI or leave it for main chart */}
    </Card>

    {/* Main Chart Skeleton */}
    <Card className="lg:col-span-3 p-4">
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </Card>

    {/* Bottom Charts Skeletons */}
    <Card className="lg:col-span-3 lg:grid lg:grid-cols-2 gap-6">
        <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
         <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
        </div>
    </Card>
  </div>
);