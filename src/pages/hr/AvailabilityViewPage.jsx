import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const getRelativeDate = (dayOffset, hour, minute) => {
  const base = new Date();
  const date = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate() + dayOffset,
    hour,
    minute,
    0,
    0
  );
  return date;
};

const mockAvailability = [
  {
    id: 1,
    title: 'John Doe - Java, React',
    start: getRelativeDate(1, 10, 0),
    end: getRelativeDate(1, 12, 0),
    resource: {
      interviewer: 'John Doe',
      skills: ['Java', 'React'],
      status: 'OPEN',
      department: 'Engineering',
    },
  },
  {
    id: 2,
    title: 'Jane Smith - Python, .NET',
    start: getRelativeDate(2, 14, 0),
    end: getRelativeDate(2, 16, 0),
    resource: {
      interviewer: 'Jane Smith',
      skills: ['Python', '.NET'],
      status: 'CONFIRMED',
      department: 'Engineering',
    },
  },
  {
    id: 3,
    title: 'Mike Johnson - AWS, DevOps',
    start: getRelativeDate(3, 9, 0),
    end: getRelativeDate(3, 11, 0),
    resource: {
      interviewer: 'Mike Johnson',
      skills: ['AWS', 'DevOps'],
      status: 'REQUESTED',
      department: 'DevOps',
    },
  },
  {
    id: 4,
    title: 'Sarah Williams - Testing, Python',
    start: getRelativeDate(1, 15, 0),
    end: getRelativeDate(1, 17, 0),
    resource: {
      interviewer: 'Sarah Williams',
      skills: ['Testing', 'Python'],
      status: 'OPEN',
      department: 'QA',
    },
  },
  {
    id: 5,
    title: 'David Brown - React, Node.js',
    start: getRelativeDate(4, 10, 0),
    end: getRelativeDate(4, 12, 0),
    resource: {
      interviewer: 'David Brown',
      skills: ['React', 'Node.js'],
      status: 'COMPLETED',
      department: 'Engineering',
    },
  },
];

const AvailabilityViewPage = () => {
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterSkill, setFilterSkill] = useState('ALL');
  const [allEvents] = useState(mockAvailability);

  // Filter events based on selected criteria
  const filteredEvents = allEvents.filter(event => {
    const matchesDept = filterDept === 'ALL' || event.resource.department === filterDept;
    const matchesSkill = filterSkill === 'ALL' || 
                        event.resource.skills.some(skill => 
                          skill.toLowerCase().includes(filterSkill.toLowerCase())
                        );
    return matchesDept && matchesSkill;
  });

  const eventStyleGetter = (event) => {
    const colors = {
      OPEN: { backgroundColor: 'hsl(var(--success))', color: 'white' },
      REQUESTED: { backgroundColor: 'hsl(var(--warning))', color: 'white' },
      CONFIRMED: { backgroundColor: 'hsl(var(--primary))', color: 'white' },
      COMPLETED: { backgroundColor: 'hsl(var(--muted))', color: 'white' },
    };
    return { style: colors[event.resource.status] || colors.OPEN };
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interviewer Availability</h1>
          <p className="text-muted-foreground">View all interviewer availability across teams</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4 items-center justify-between flex-wrap">
              <CardTitle>Availability Calendar</CardTitle>
              <div className="flex gap-2">
                <Select value={filterDept} onValueChange={setFilterDept}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSkill} onValueChange={setFilterSkill}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Skills</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="aws">AWS</SelectItem>
                    <SelectItem value="dotnet">.NET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {filteredEvents.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Showing {filteredEvents.length} of {allEvents.length} available slots
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--success))' }}></div>
                <span className="text-sm">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--warning))' }}></div>
                <span className="text-sm">Requested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--primary))' }}></div>
                <span className="text-sm">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--muted))' }}></div>
                <span className="text-sm">Completed</span>
              </div>
            </div>
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                defaultView="week"
                tooltipAccessor={(event) => 
                  `${event.resource.interviewer} - ${event.resource.skills.join(', ')}`
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AvailabilityViewPage;
