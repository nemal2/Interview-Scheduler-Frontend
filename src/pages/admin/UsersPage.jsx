import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Shield, UserX, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@mitra.com', role: 'INTERVIEWER', designation: 'Tech Lead', department: 'Engineering', status: 'ACTIVE' },
  { id: 2, name: 'Jane Smith', email: 'jane@mitra.com', role: 'INTERVIEWER', designation: 'Senior Engineer', department: 'QA', status: 'ACTIVE' },
  { id: 3, name: 'Sarah Johnson', email: 'sarah@mitra.com', role: 'HR', department: 'HR', status: 'ACTIVE' },
  { id: 4, name: 'Mike Wilson', email: 'mike@mitra.com', role: 'INTERVIEWER', designation: 'Software Engineer', department: 'Engineering', status: 'INACTIVE' },
];

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-secondary-light text-secondary',
      HR: 'bg-primary-light text-primary',
      INTERVIEWER: 'bg-success-light text-success',
    };
    return colors[role];
  };

  const getStatusColor = (status) => {
    return status === 'ACTIVE' ? 'bg-success-light text-success' : 'bg-muted text-muted-foreground';
  };

  const handleCreateUser = () => {
    if (!firstName || !lastName || !email || !role || !department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      role: role.toUpperCase(),
      department: department,
      designation: role === 'interviewer' ? 'Software Engineer' : '',
      status: 'ACTIVE'
    };

    setUsers([...users, newUser]);
    
    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRole('');
    setDepartment('');
    setIsAddDialogOpen(false);

    toast({
      title: "User Created",
      description: `${newUser.name} has been successfully added`,
    });
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toast({
          title: "Status Updated",
          description: `User status changed to ${newStatus}`,
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "User Deleted",
      description: "The user has been removed",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their roles</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name" 
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name" 
                    />
                  </div>
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email" 
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number" 
                  />
                </div>
                <div>
                  <Label>Role *</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="interviewer">Interviewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department *</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="QA">QA</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleCreateUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="INTERVIEWER">Interviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              {user.designation && <span>{user.designation}</span>}
                              {user.department && <span>• {user.department}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === 'ACTIVE' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
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

export default UsersPage;
