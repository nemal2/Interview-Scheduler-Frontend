import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const mockDesignations = [
  { id: 1, name: 'Software Engineer', level: 1, description: 'Entry level developer', isActive: true },
  { id: 2, name: 'Senior Software Engineer', level: 2, description: 'Experienced developer', isActive: true },
  { id: 3, name: 'Tech Lead', level: 3, description: 'Technical leadership role', isActive: true },
  { id: 4, name: 'Senior Tech Lead', level: 4, description: 'Senior technical leadership', isActive: true },
  { id: 5, name: 'Software Architect', level: 5, description: 'Architecture and design lead', isActive: true },
];

const DesignationsPage = () => {
  const [designations, setDesignations] = useState(mockDesignations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [designationName, setDesignationName] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-primary-light text-primary',
      2: 'bg-success-light text-success',
      3: 'bg-warning-light text-warning',
      4: 'bg-secondary-light text-secondary',
      5: 'bg-accent text-accent-foreground',
    };
    return colors[level] || 'bg-muted text-muted-foreground';
  };

  const handleAddDesignation = () => {
    if (!designationName || !level || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const levelNum = parseInt(level);
    if (levelNum < 1 || levelNum > 5) {
      toast({
        title: "Invalid Level",
        description: "Level must be between 1 and 5",
        variant: "destructive"
      });
      return;
    }

    const newDesignation = {
      id: designations.length + 1,
      name: designationName,
      level: levelNum,
      description: description,
      isActive: true
    };

    setDesignations([...designations, newDesignation]);
    
    // Reset form
    setDesignationName('');
    setLevel('');
    setDescription('');
    setIsAddDialogOpen(false);

    toast({
      title: "Designation Added",
      description: `${designationName} has been successfully added`,
    });
  };

  const handleDeleteDesignation = (id) => {
    setDesignations(designations.filter(des => des.id !== id));
    toast({
      title: "Designation Deleted",
      description: "The designation has been removed",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Designations</h1>
            <p className="text-muted-foreground">Manage designation hierarchy and levels</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Designation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Designation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Designation Name *</Label>
                  <Input 
                    value={designationName}
                    onChange={(e) => setDesignationName(e.target.value)}
                    placeholder="e.g., Senior Software Engineer" 
                  />
                </div>
                <div>
                  <Label>Hierarchy Level (1-5) *</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Enter level" 
                  />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleAddDesignation}>Add Designation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Designation Hierarchy ({designations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {designations.sort((a, b) => a.level - b.level).map((designation, index) => (
                <motion.div
                  key={designation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Badge className={getLevelColor(designation.level)}>
                            Level {designation.level}
                          </Badge>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{designation.name}</h3>
                            <p className="text-sm text-muted-foreground">{designation.description}</p>
                          </div>
                          {index < designations.length - 1 && (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDesignation(designation.id)}
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

        <Card>
          <CardHeader>
            <CardTitle>Interview Eligibility Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Level 5 (Architect) can interview all levels</p>
              <p>• Level 4 (Senior Tech Lead) can interview Level 1-3</p>
              <p>• Level 3 (Tech Lead) can interview Level 1-2</p>
              <p>• Level 2 (Senior Engineer) can interview Level 1</p>
              <p>• Level 1 cannot conduct interviews</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DesignationsPage;
