import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Settings } from 'lucide-react';
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

const InterviewerDashboard = () => {
  const stats = [
    {
      icon: Calendar,
      title: 'Available Slots',
      value: '12',
      description: 'This week',
      color: 'bg-primary',
    },
    {
      icon: Clock,
      title: 'Pending Requests',
      value: '3',
      description: 'Awaiting confirmation',
      color: 'bg-warning',
    },
    {
      icon: CheckCircle,
      title: 'Completed',
      value: '45',
      description: 'This month',
      color: 'bg-success',
    },
    {
      icon: TrendingUp,
      title: 'Avg Rating',
      value: '4.8',
      description: 'Based on 45 feedbacks',
      color: 'bg-secondary',
    },
  ];

  const interviewRequests = [
    {
      candidateName: 'Michael Chen',
      position: 'Senior Software Engineer - Java',
      requestedBy: 'Sarah Johnson (HR)',
      date: 'March 15, 2024',
      timeSlot: '2:00 PM - 3:30 PM',
      status: 'pending',
      technologies: ['Java', 'Spring Boot', 'Microservices'],
    },
    {
      candidateName: 'Emily Rodriguez',
      position: 'Tech Lead - React',
      requestedBy: 'David Lee (HR)',
      date: 'March 16, 2024',
      timeSlot: '10:00 AM - 11:30 AM',
      status: 'pending',
      technologies: ['React', 'TypeScript', 'Node.js'],
    },
  ];

  const upcomingInterviews = [
    {
      candidateName: 'Alice Johnson',
      position: 'Software Engineer',
      date: 'Today',
      time: '4:00 PM',
      coInterviewer: 'Sarah Smith',
    },
    {
      candidateName: 'Bob Williams',
      position: 'Senior Developer',
      date: 'Tomorrow',
      time: '11:00 AM',
      coInterviewer: null,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Interviewer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your availability and interview schedule
            </p>
          </div>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Update Profile
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Interview Requests
              </CardTitle>
              <CardDescription>Review and confirm interview requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviewRequests.map((request, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border space-y-3"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{request.candidateName}</h4>
                      <p className="text-sm text-muted-foreground">{request.position}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {request.date} at {request.timeSlot}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {request.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">Accept</Button>
                      <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
                <CardDescription>Your confirmed interview schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingInterviews.map((interview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-accent space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{interview.candidateName}</h4>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                        </div>
                        <Badge className="bg-success-light text-success">Confirmed</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {interview.date} at {interview.time}
                      </div>
                      {interview.coInterviewer && (
                        <p className="text-xs text-muted-foreground">
                          Co-interviewer: {interview.coInterviewer}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Calendar className="w-4 h-4" />
                    Manage Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Settings className="w-4 h-4" />
                    Update Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewerDashboard;
