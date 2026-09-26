import React from 'react';
import { StatCards } from '../StatCards';
import { SalesChart } from '../SalesChart';
import { QuickActions } from '../QuickActions';
import { RecentOperations } from '../RecentOperations';
import { PromoCard } from '../PromoCard';

export const HomeTab: React.FC = () => {
  return (
    <div className="space-y-2.5 pb-4">
      {/* 8 Metric KPI Cards (4 in top row, 4 in bottom row) */}
      <StatCards />

      {/* 7-Day Sales & Collections Dual-Line Chart */}
      <SalesChart />

      {/* 5 Pastel Quick Action Buttons */}
      <QuickActions />

      {/* Lower Section: Recent Operations + Promo & Reminders */}
      <div className="px-2.5 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 items-stretch">
        <RecentOperations />
        <PromoCard />
      </div>
    </div>
  );
};
