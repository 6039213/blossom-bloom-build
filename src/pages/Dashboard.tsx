
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RecentProjects from '@/components/dashboard/RecentProjects';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickStats from '@/components/dashboard/QuickStats';

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex h-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-6 bg-amber-50/30 dark:bg-amber-900/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-300 mb-6">Dashboard</h1>
              
              <QuickStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <RecentProjects />
                </div>
                <div>
                  <ActivityFeed />
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
