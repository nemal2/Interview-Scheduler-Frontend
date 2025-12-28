import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const RequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      candidateName: 'Michael Chen',
      position: 'Senior Software Engineer - Java',
      requestedBy: 'Sarah Johnson (HR)',
      date: 'March 15, 2024',
      timeSlot: '2:00 PM - 3:30 PM',
      status: 'pending',
      technologies: ['Java', 'Spring Boot', 'Microservices'],
      location: 'Virtual - Teams',
      coInterviewer: 'John Doe',
    },
    {
      id: 2,
      candidateName: 'Emily Rodriguez',
      position: 'Tech Lead - React',
      requestedBy: 'David Lee (HR)',
      date: 'March 16, 2024',
      timeSlot: '10:00 AM - 11:30 AM',
      status: 'pending',
      technologies: ['React', 'TypeScript', 'Node.js'],
      location: 'Virtual - Zoom',
      coInterviewer: null,
    },
    {
      id: 3,
      candidateName: 'Alice Johnson',
      position: 'Software Engineer',
      requestedBy: 'Sarah Johnson (HR)',
      date: 'March 14, 2024',
      timeSlot: '4:00 PM - 5:30 PM',
      status: 'accepted',
      technologies: ['JavaScript', 'React', 'CSS'],
      location: 'Virtual - Teams',
      coInterviewer: 'Sarah Smith',
    },
  ]);

  const handleAccept = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
    toast.success('Interview request accepted!');
  };

  const handleDecline = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'declined' } : req
    ));
    toast.success('Interview request declined');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const declinedRequests = requests.filter(r => r.status === 'declined');

  const RequestCard = ({ request, showActions = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-elegant hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {request.candidateName}
                </h3>
                <p className="text-sm text-muted-foreground">{request.position}</p>
              </div>
              <Badge
                className={
                  request.status === 'pending'
                    ? 'bg-warning-light text-warning'
                    : request.status === 'accepted'
                    ? 'bg-success-light text-success'
                    : 'bg-destructive text-destructive-foreground'
                }
              >
                {request.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{request.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{request.timeSlot}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{request.requestedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {request.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {request.coInterviewer && (
              <div className="p-3 bg-accent rounded-lg">
                <p className="text-xs font-medium text-muted-foreground">Co-Interviewer:</p>
                <p className="text-sm">{request.coInterviewer}</p>
              </div>
            )}

            {showActions && request.status === 'pending' && (
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleAccept(request.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => handleDecline(request.id)}
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Requests</h1>
          <p className="text-muted-foreground">
            Review and respond to interview requests from HR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <div className="p-2 rounded-lg bg-warning-light">
                <Clock className="w-4 h-4 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{pendingRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your response</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accepted
              </CardTitle>
              <div className="p-2 rounded-lg bg-success-light">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{acceptedRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Confirmed interviews</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Declined
              </CardTitle>
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{declinedRequests.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requests declined</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="declined">
              Declined ({declinedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card className="shadow-elegant">
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <RequestCard key={request.id} request={request} showActions />
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <Card className="shadow-elegant">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No accepted requests</p>
                </CardContent>
              </Card>
            ) : (
              acceptedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="declined" className="space-y-4">
            {declinedRequests.length === 0 ? (
              <Card className="shadow-elegant">
                <CardContent className="p-12 text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No declined requests</p>
                </CardContent>
              </Card>
            ) : (
              declinedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RequestsPage;
