import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const mockTechnologies = [
  { id: 1, name: 'Java', category: 'LANGUAGE', isActive: true },
  { id: 2, name: 'React', category: 'FRAMEWORK', isActive: true },
  { id: 3, name: 'Python', category: 'LANGUAGE', isActive: true },
  { id: 4, name: '.NET', category: 'FRAMEWORK', isActive: true },
  { id: 5, name: 'PostgreSQL', category: 'DATABASE', isActive: true },
  { id: 6, name: 'AWS', category: 'CLOUD', isActive: true },
  { id: 7, name: 'Docker', category: 'DEVOPS', isActive: true },
  { id: 8, name: 'Angular', category: 'FRAMEWORK', isActive: true },
];

const TechnologiesPage = () => {
  const [technologies, setTechnologies] = useState(mockTechnologies);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [techName, setTechName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const filteredTechnologies = technologies.filter(tech => 
    filterCategory === 'ALL' || tech.category === filterCategory
  );

  const getCategoryColor = (category) => {
    const colors = {
      LANGUAGE: 'bg-primary-light text-primary',
      FRAMEWORK: 'bg-success-light text-success',
      DATABASE: 'bg-secondary-light text-secondary',
      CLOUD: 'bg-warning-light text-warning',
      DEVOPS: 'bg-accent text-accent-foreground',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  const groupByCategory = (techs) => {
    return techs.reduce((acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    }, {});
  };

  const handleAddTechnology = () => {
    if (!techName || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in technology name and category",
        variant: "destructive"
      });
      return;
    }

    const newTech = {
      id: technologies.length + 1,
      name: techName,
      category: category,
      description: description,
      isActive: true
    };

    setTechnologies([...technologies, newTech]);
    
    // Reset form
    setTechName('');
    setCategory('');
    setDescription('');
    setIsAddDialogOpen(false);

    toast({
      title: "Technology Added",
      description: `${techName} has been successfully added`,
    });
  };

  const handleDeleteTechnology = (id) => {
    setTechnologies(technologies.filter(tech => tech.id !== id));
    toast({
      title: "Technology Deleted",
      description: "The technology has been removed",
    });
  };

  const grouped = groupByCategory(filteredTechnologies);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Technologies</h1>
            <p className="text-muted-foreground">Manage technology stack and skills</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Technology
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Technology</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Technology Name *</Label>
                  <Input 
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    placeholder="e.g., React, Java, AWS" 
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LANGUAGE">Language</SelectItem>
                      <SelectItem value="FRAMEWORK">Framework</SelectItem>
                      <SelectItem value="DATABASE">Database</SelectItem>
                      <SelectItem value="CLOUD">Cloud</SelectItem>
                      <SelectItem value="DEVOPS">DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="button" onClick={handleAddTechnology}>Add Technology</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Technology Stack ({technologies.length})</CardTitle>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="LANGUAGE">Languages</SelectItem>
                  <SelectItem value="FRAMEWORK">Frameworks</SelectItem>
                  <SelectItem value="DATABASE">Databases</SelectItem>
                  <SelectItem value="CLOUD">Cloud</SelectItem>
                  <SelectItem value="DEVOPS">DevOps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, techs], catIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIndex * 0.1 }}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      {category} ({techs.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {techs.map((tech, index) => (
                        <Card key={tech.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Code2 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{tech.name}</h4>
                                  <Badge className={getCategoryColor(tech.category)} size="sm">
                                    {tech.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteTechnology(tech.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TechnologiesPage;
