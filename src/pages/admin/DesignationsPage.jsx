import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Building2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { designationAPI } from '@/services/designationAPI';
import { departmentAPI } from '@/services/departmentAPI';

const DesignationsPage = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    hierarchyLevel: '',
    departmentId: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDepartment === 'all') {
      loadData();
    } else {
      filterDesignations();
    }
  }, [selectedDepartment]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [designationsData, departmentsData] = await Promise.all([
        designationAPI.getAllDesignations(),
        departmentAPI.getAllDepartments()
      ]);
      setDesignations(designationsData || []);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDesignations = async () => {
    try {
      setLoading(true);
      const data = await designationAPI.getDesignationsByDepartment(parseInt(selectedDepartment));
      setDesignations(data || []);
    } catch (error) {
      console.error('Error filtering:', error);
      toast({
        title: "Error",
        description: "Failed to filter designations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshDesignations = async () => {
    if (selectedDepartment === 'all') {
      await loadData();
    } else {
      await filterDesignations();
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      1: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
      2: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
      3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
      4: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
      5: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
      6: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
      7: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
      8: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
      9: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200',
      10: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200';
  };

  const resetForm = () => {
    setFormData({ name: '', hierarchyLevel: '', departmentId: '', description: '' });
  };

  const handleOpenAddDialog = (e) => {
    e?.stopPropagation();
    console.log('Opening Add Dialog');
    resetForm();
    setTimeout(() => setIsAddDialogOpen(true), 0);
  };

  const handleCloseAddDialog = () => {
    console.log('Closing Add Dialog');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleAddDesignation = async () => {
    console.log('Add button clicked, formData:', formData);

    if (!formData.name?.trim() || !formData.hierarchyLevel || !formData.departmentId) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    const level = parseInt(formData.hierarchyLevel);
    if (isNaN(level) || level < 1 || level > 10) {
      toast({ 
        title: "Validation Error", 
        description: "Hierarchy level must be between 1 and 10",
        variant: "destructive" 
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      hierarchyLevel: level,
      departmentId: parseInt(formData.departmentId),
      description: formData.description?.trim() || null
    };

    console.log('Sending payload to backend:', payload);
    setIsMutating(true);

    try {
      const result = await designationAPI.createDesignation(payload);
      console.log('Backend response:', result);
      
      await refreshDesignations();
      handleCloseAddDialog();
      
      toast({ 
        title: "Success", 
        description: "Designation created successfully" 
      });
    } catch (err) {
      console.error('Error creating designation:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create designation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleOpenEditDialog = (des) => {
    console.log('Opening Edit Dialog for:', des);
    setEditingDesignation(des);
    setFormData({
      name: des.name || '',
      hierarchyLevel: des.hierarchyLevel?.toString() || '',
      departmentId: des.departmentId?.toString() || '',
      description: des.description || ''
    });
    setTimeout(() => setIsEditDialogOpen(true), 0);
  };

  const handleCloseEditDialog = () => {
    console.log('Closing Edit Dialog');
    setIsEditDialogOpen(false);
    setEditingDesignation(null);
    resetForm();
  };

  const handleEditDesignation = async () => {
    console.log('Update button clicked, formData:', formData);

    if (!formData.name?.trim() || !formData.hierarchyLevel) {
      toast({ 
        title: "Validation Error", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    const level = parseInt(formData.hierarchyLevel);
    if (isNaN(level) || level < 1 || level > 10) {
      toast({ 
        title: "Validation Error", 
        description: "Hierarchy level must be between 1 and 10",
        variant: "destructive" 
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      hierarchyLevel: level,
      description: formData.description?.trim() || null
    };

    console.log('Updating designation ID:', editingDesignation.id, 'with payload:', payload);
    setIsMutating(true);

    try {
      const result = await designationAPI.updateDesignation(editingDesignation.id, payload);
      console.log('Backend response:', result);
      
      await refreshDesignations();
      handleCloseEditDialog();
      
      toast({ 
        title: "Success", 
        description: "Designation updated successfully" 
      });
    } catch (err) {
      console.error('Error updating designation:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update designation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteDesignation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;

    console.log('Deleting designation ID:', id);
    setIsMutating(true);

    try {
      await designationAPI.deleteDesignation(id);
      console.log('Designation deleted successfully');
      
      await refreshDesignations();
      
      toast({ 
        title: "Success", 
        description: "Designation deleted successfully" 
      });
    } catch (err) {
      console.error('Error deleting designation:', err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete designation";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleMove = async (deptName, index, direction) => {
    const group = [...groupedDesignations[deptName]].sort((a, b) => a.hierarchyLevel - b.hierarchyLevel);
    
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === group.length - 1)) {
      return;
    }

    const current = group[index];
    const target = direction === 'up' ? group[index - 1] : group[index + 1];

    const tempLevel = current.hierarchyLevel;
    const updateCurrent = { hierarchyLevel: target.hierarchyLevel };
    const updateTarget = { hierarchyLevel: tempLevel };

    console.log('Moving designations:', { current: current.id, target: target.id, direction });
    setIsMutating(true);

    try {
      await Promise.all([
        designationAPI.updateDesignation(current.id, updateCurrent),
        designationAPI.updateDesignation(target.id, updateTarget)
      ]);
      
      await refreshDesignations();
      
      toast({ 
        title: "Success", 
        description: "Order updated successfully" 
      });
    } catch (err) {
      console.error('Error reordering:', err);
      toast({ 
        title: "Error", 
        description: "Failed to reorder designations",
        variant: "destructive" 
      });
    } finally {
      setIsMutating(false);
    }
  };

  const groupedDesignations = designations.reduce((acc, des) => {
    const dept = des.departmentName || 'Unassigned';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(des);
    return acc;
  }, {});

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Designations</h1>
            <p className="text-muted-foreground mt-1">Manage organizational hierarchy per department</p>
          </div>
          <Button onClick={handleOpenAddDialog} disabled={isMutating}>
            <Plus className="mr-2 h-4 w-4" />
            Add Designation
          </Button>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Designation</DialogTitle>
              <DialogDescription>
                Create a new designation for your organization. All fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Designation Name *</Label>
                <Input 
                  id="add-name"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Senior Manager"
                  disabled={isMutating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-department">Department *</Label>
                <Select 
                  value={formData.departmentId} 
                  onValueChange={v => setFormData({...formData, departmentId: v})}
                  disabled={isMutating}
                >
                  <SelectTrigger id="add-department">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(d => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-level">Hierarchy Level (1-10) *</Label>
                <Input 
                  id="add-level"
                  type="number" 
                  min="1" 
                  max="10" 
                  value={formData.hierarchyLevel}
                  onChange={e => setFormData({...formData, hierarchyLevel: e.target.value})}
                  placeholder="1 (highest) to 10 (lowest)"
                  disabled={isMutating}
                />
                <p className="text-xs text-muted-foreground">Lower numbers = higher positions</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description (Optional)</Label>
                <Textarea 
                  id="add-description"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description..."
                  rows={3}
                  disabled={isMutating}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCloseAddDialog} 
                disabled={isMutating}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleAddDesignation} 
                disabled={isMutating}
              >
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isMutating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Designation</DialogTitle>
              <DialogDescription>
                Update designation details. Department cannot be changed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Designation Name *</Label>
                <Input 
                  id="edit-name"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  disabled={isMutating}
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <div className="py-2 px-3 bg-muted rounded-md text-sm font-medium">
                  {editingDesignation?.departmentName || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Hierarchy Level (1-10) *</Label>
                <Input 
                  id="edit-level"
                  type="number" 
                  min="1" 
                  max="10" 
                  value={formData.hierarchyLevel}
                  onChange={e => setFormData({...formData, hierarchyLevel: e.target.value})}
                  disabled={isMutating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  disabled={isMutating}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleCloseEditDialog} 
                disabled={isMutating}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleEditDesignation} 
                disabled={isMutating}
              >
                {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isMutating ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">Filter by Department:</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(d => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Designations List */}
        {Object.keys(groupedDesignations).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No designations found</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedDesignations).map(([deptName, items]) => (
            <Card key={deptName}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {deptName} ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...items]
                    .sort((a, b) => a.hierarchyLevel - b.hierarchyLevel)
                    .map((des, idx, arr) => (
                      <Card key={des.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Badge className={`${getLevelColor(des.hierarchyLevel)} whitespace-nowrap`}>
                              Level {des.hierarchyLevel}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold truncate">{des.name}</h3>
                              {des.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {des.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleOpenEditDialog(des)} 
                              disabled={isMutating}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleDeleteDesignation(des.id)} 
                              disabled={isMutating}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {idx > 0 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMove(deptName, idx, 'up')} 
                                disabled={isMutating}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                            )}
                            {idx < arr.length - 1 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleMove(deptName, idx, 'down')} 
                                disabled={isMutating}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default DesignationsPage;