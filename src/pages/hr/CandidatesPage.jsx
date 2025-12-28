import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Mail, Phone, FileText, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCandidates = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', phone: '+1234567890', designation: 'Senior Software Engineer', status: 'SCREENING', appliedAt: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@email.com', phone: '+1234567891', designation: 'Tech Lead', status: 'SCHEDULED', appliedAt: '2024-01-14' },
  { id: 3, name: 'Carol White', email: 'carol@email.com', phone: '+1234567892', designation: 'Software Engineer', status: 'INTERVIEWED', appliedAt: '2024-01-13' },
];

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
  });

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.designation) {
      return;
    }
    
    const candidate = {
      id: candidates.length + 1,
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      designation: newCandidate.designation,
      status: 'APPLIED',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    
    setCandidates([candidate, ...candidates]);
    setIsAddDialogOpen(false);
    setNewCandidate({ name: '', email: '', phone: '', designation: '' });
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      APPLIED: 'bg-blue-100 text-blue-800',
      SCREENING: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-purple-100 text-purple-800',
      INTERVIEWED: 'bg-indigo-100 text-indigo-800',
      SELECTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
            <p className="text-muted-foreground">Manage and track all candidates</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input 
                    placeholder="Enter candidate name" 
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Enter email" 
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input 
                    placeholder="Enter phone number" 
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Target Designation</Label>
                  <Select value={newCandidate.designation} onValueChange={(value) => setNewCandidate({...newCandidate, designation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Senior Software Engineer">Senior Software Engineer</SelectItem>
                      <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                      <SelectItem value="Architect">Architect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleAddCandidate}>Add Candidate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SCREENING">Screening</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
                  <SelectItem value="SELECTED">Selected</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {candidate.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {candidate.phone}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Target: </span>
                            {candidate.designation}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CandidatesPage;
