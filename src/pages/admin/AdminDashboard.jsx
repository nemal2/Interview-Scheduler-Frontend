import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="shadow-elegant">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '248',
      description: '12 added this month',
      color: 'bg-primary',
    },
    {
      icon: Shield,
      title: 'Active Interviewers',
      value: '89',
      description: '45 available today',
      color: 'bg-success',
    },
    {
      icon: Calendar,
      title: 'Scheduled Interviews',
      value: '156',
      description: '23 pending approval',
      color: 'bg-secondary',
    },
    {
      icon: CheckCircle,
      title: 'Completed This Month',
      value: '342',
      description: '+18% from last month',
      color: 'bg-success',
    },
    {
      icon: Clock,
      title: 'Avg Response Time',
      value: '2.4h',
      description: '-0.5h improvement',
      color: 'bg-warning',
    },
    {
      icon: TrendingUp,
      title: 'System Utilization',
      value: '87%',
      description: 'Optimal performance',
      color: 'bg-primary',
    },
  ];

  const recentActivities = [
    { action: 'New interviewer registered', user: 'John Smith', time: '5 minutes ago', type: 'user' },
    { action: 'Custom rule created', user: 'Admin', time: '1 hour ago', type: 'rule' },
    { action: 'Designation hierarchy updated', user: 'Admin', time: '2 hours ago', type: 'config' },
    { action: 'Technology stack added', user: 'Admin', time: '3 hours ago', type: 'tech' },
    { action: 'Urgent interview broadcast sent', user: 'Sarah Johnson (HR)', time: '4 hours ago', type: 'urgent' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and management controls
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add User', icon: Users, path: '/admin/users' },
                  { label: 'Create Rule', icon: Shield, path: '/admin/rules' },
                  { label: 'View Analytics', icon: TrendingUp, path: '/admin/analytics' },
                  { label: 'Manage Tech', icon: CheckCircle, path: '/admin/technologies' },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => window.location.href = action.path}
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
