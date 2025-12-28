import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Briefcase, Award, Edit2, Save, Plus, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const designationOptions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Senior Tech Lead',
  'Architect',
  'Principal Engineer',
  'Engineering Manager',
  'Director of Engineering'
];

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@mitra.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    employeeCode: 'ENG-2024-001',
    yearsOfExperience: 8,
    bio: 'Experienced software engineer specializing in full-stack development with a focus on Java and React technologies. Passionate about mentoring junior developers and conducting technical interviews.',
    technologies: ['Java', 'Spring Boot', 'React', 'TypeScript', 'AWS', 'Docker', 'Microservices'],
    willingToInterview: ['Java', 'Spring Boot', 'React', 'System Design'],
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const getInitials = () => {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.technologies.includes(newSkill.trim())) {
      setProfile({ ...profile, technologies: [...profile.technologies, newSkill.trim()] });
      setNewSkill('');
      toast.success('Skill added');
    }
  };

  const handleRemoveSkill = (skill) => {
    setProfile({ ...profile, technologies: profile.technologies.filter(s => s !== skill) });
    toast.success('Skill removed');
  };

  const handleAddPreference = () => {
    if (newPreference.trim() && !profile.willingToInterview.includes(newPreference.trim())) {
      setProfile({ ...profile, willingToInterview: [...profile.willingToInterview, newPreference.trim()] });
      setNewPreference('');
      toast.success('Interview preference added');
    }
  };

  const handleRemovePreference = (pref) => {
    setProfile({ ...profile, willingToInterview: profile.willingToInterview.filter(p => p !== pref) });
    toast.success('Interview preference removed');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and interview preferences
            </p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-elegant">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="gradient-primary text-white text-3xl font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-muted-foreground">{profile.designation}</p>
                  <Badge className="mt-2 bg-primary-light text-primary">
                    {profile.employeeCode}
                  </Badge>
                </div>

                <div className="w-full space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile.yearsOfExperience} years experience
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update your personal details' : 'Your personal details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
                <CardDescription>Your role and department information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={profile.department} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    {isEditing ? (
                      <Select
                        value={profile.designation}
                        onValueChange={(value) => handleChange('designation', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          {designationOptions.map((designation) => (
                            <SelectItem key={designation} value={designation}>
                              {designation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={profile.designation} disabled className="bg-muted" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Employee Code</Label>
                    <Input value={profile.employeeCode} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={profile.yearsOfExperience}
                      onChange={(e) => handleChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      min={0}
                      max={50}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>Technologies you're proficient in</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button onClick={handleAddSkill} size="sm" className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-sm gap-1 pr-1">
                      {tech}
                      <button
                        onClick={() => handleRemoveSkill(tech)}
                        className="ml-1 hover:text-destructive rounded-full hover:bg-destructive/10 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Interview Preferences</CardTitle>
                <CardDescription>Technologies you're willing to conduct interviews for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add interview preference..."
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPreference()}
                  />
                  <Button onClick={handleAddPreference} size="sm" className="shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.willingToInterview.map((tech) => (
                    <Badge key={tech} className="bg-success-light text-success text-sm gap-1 pr-1">
                      {tech}
                      <button
                        onClick={() => handleRemovePreference(tech)}
                        className="ml-1 hover:text-destructive rounded-full hover:bg-destructive/10 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;