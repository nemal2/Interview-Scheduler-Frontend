import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

const HRDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      icon: Users,
      title: 'Active Candidates',
      value: '45',
      description: '12 new this week',
      color: 'bg-primary',
    },
    {
      icon: Calendar,
      title: 'Scheduled Today',
      value: '8',
      description: '3 pending confirmation',
      color: 'bg-secondary',
    },
    {
      icon: Clock,
      title: 'Pending Scheduling',
      value: '23',
      description: 'Awaiting interviewer',
      color: 'bg-warning',
    },
    {
      icon: CheckCircle,
      title: 'Completed This Week',
      value: '67',
      description: '+12% from last week',
      color: 'bg-success',
    },
  ];

  const upcomingInterviews = [
    {
      candidateName: 'Alice Johnson',
      position: 'Senior Software Engineer',
      time: 'Today, 2:00 PM',
      interviewers: ['John Doe', 'Sarah Smith'],
      status: 'confirmed',
    },
    {
      candidateName: 'Bob Williams',
      position: 'Tech Lead',
      time: 'Today, 4:00 PM',
      interviewers: ['Michael Brown'],
      status: 'pending',
    },
    {
      candidateName: 'Carol Davis',
      position: 'Software Engineer',
      time: 'Tomorrow, 10:00 AM',
      interviewers: ['Emma Wilson', 'James Miller'],
      status: 'confirmed',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-success-light text-success',
      pending: 'bg-warning-light text-warning',
      cancelled: 'bg-destructive text-destructive-foreground',
    };
    return styles[status] || styles.pending;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">HR Dashboard</h1>
            <p className="text-muted-foreground">
              Manage candidates and schedule interviews
            </p>
          </div>
          <Button className="gap-2" onClick={() => navigate('/hr/candidates')}>
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Next scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInterviews.map((interview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">
                          {interview.candidateName}
                        </h4>
                        <Badge className={getStatusBadge(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {interview.time}
                      </div>
                      <div className="flex items-center gap-2">
                        {interview.interviewers.map((name, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Schedule Interview', icon: Calendar, path: '/hr/schedule' },
                  { label: 'View Availability', icon: Clock, path: '/hr/availability' },
                  { label: 'Send Urgent Request', icon: AlertCircle, path: '/hr/urgent' },
                  { label: 'Manage Candidates', icon: Users, path: '/hr/candidates' },
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => navigate(action.path)}
                      >
                        <Icon className="w-4 h-4" />
                        {action.label}
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

export default HRDashboard;
