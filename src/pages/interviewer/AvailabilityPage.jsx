import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const AvailabilityPage = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Available',
      start: new Date(2024, 2, 15, 10, 0),
      end: new Date(2024, 2, 15, 12, 0),
      status: 'open',
    },
    {
      id: 2,
      title: 'Available',
      start: new Date(2024, 2, 16, 14, 0),
      end: new Date(2024, 2, 16, 16, 0),
      status: 'open',
    },
    {
      id: 3,
      title: 'Interview Scheduled',
      start: new Date(2024, 2, 18, 11, 0),
      end: new Date(2024, 2, 18, 12, 30),
      status: 'booked',
    },
  ]);

  // Legacy flag kept so any remaining references don’t break the page
  const [showAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);

    if (start instanceof Date) {
      // Check if time is at midnight (month view click) and default to 9 AM
      const isMonthViewClick = start.getHours() === 0 && start.getMinutes() === 0;
      
      let startDate = new Date(start);
      if (isMonthViewClick) {
        startDate.setHours(9, 0, 0, 0); // Default to 9 AM for month view
      }
      
      const end = new Date(startDate.getTime() + 60 * 60 * 1000); // 1-hour duration
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(end, 'HH:mm'));

      toast({
        title: 'Time range selected',
        description: `${format(startDate, 'MMM dd, yyyy')} • ${format(startDate, 'HH:mm')} - ${format(end, 'HH:mm')}. Adjust if needed, then click Add Slot.`,
      });
    }
  };

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);
    
    // Validate that end time is at least 1 hour after start time
    const [startHour, startMin] = newStartTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes - startMinutes < 60) {
      // Adjust end time to be 1 hour after start
      const newEndHour = Math.floor((startMinutes + 60) / 60);
      const newEndMin = (startMinutes + 60) % 60;
      
      if (newEndHour < 19) { // Within working hours
        setEndTime(`${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`);
      }
    }
  };

  const handleEndTimeChange = (newEndTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = newEndTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Only update if end time is at least 1 hour after start time
    if (endMinutes - startMinutes >= 60) {
      setEndTime(newEndTime);
    } else {
      toast({
        title: 'Invalid time range',
        description: 'End time must be at least 1 hour after start time',
        variant: 'destructive',
      });
    }
  };

  const handleAddSlot = () => {
    const baseDate = selectedDate || new Date();

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const start = new Date(baseDate);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(baseDate);
    end.setHours(endHour, endMin, 0, 0);

    const newEvent = {
      id: events.length + 1,
      title: description || 'Available',
      start,
      end,
      status: 'open',
      description,
    };

    setEvents([...events, newEvent]);
    setShowAddDialog(false);
    setSelectedDate(null);
    setStartTime('09:00');
    setEndTime('10:00');
    setDescription('');

    toast({
      title: 'Time slot added',
      description: `${format(start, 'MMM dd, yyyy')} • ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
    });
  };

  const handleDeleteSlot = (eventId) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = 'hsl(var(--primary))';
    if (event.status === 'booked') {
      backgroundColor = 'hsl(var(--success))';
    } else if (event.status === 'pending') {
      backgroundColor = 'hsl(var(--warning))';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const timeSlots = [];
  for (let hour = 7; hour < 19; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Availability</h1>
            <p className="text-muted-foreground">
              Manage your interview availability calendar
            </p>
          </div>
          <Button
             className="gap-2"
             onClick={() => {
               const today = new Date();
               setSelectedDate(today);
               setStartTime('09:00');
               setEndTime('10:00');
               setDescription('');
             }}
           >
            <Plus className="w-4 h-4" />
            Add Time Slot
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 shadow-elegant">
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>
                Click on a date to add availability slots. Booked slots are shown in green.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] bg-card rounded-lg p-4 shadow-elegant">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  style={{ height: '100%' }}
                  views={['week', 'day', 'month']}
                  defaultView="week"
                  step={60}
                  timeslots={1}
                  min={new Date(1970, 0, 1, 7, 0)}
                  max={new Date(1970, 0, 1, 18, 0)}
                  scrollToTime={new Date(1970, 0, 1, 7, 0)}
                  popup
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Add Availability Slot</CardTitle>
                <CardDescription>
                  Select the time range when you're available for interviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-2">
                  {selectedDate && (
                    <div className="p-3 bg-accent rounded-lg">
                      <p className="text-sm font-medium">
                        {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                   )}

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="e.g., Technical Interview, Code Review"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select value={startTime} onValueChange={handleStartTimeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select value={endTime} onValueChange={handleEndTimeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end gap-2 px-6 pb-4">
                <Button variant="outline" onClick={() => {
                  setSelectedDate(null);
                  setStartTime('09:00');
                  setEndTime('10:00');
                  setDescription('');
                }}>
                  Clear
                </Button>
                <Button onClick={handleAddSlot}>Add Slot</Button>
              </div>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span className="text-sm">Available Slots</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-success"></div>
                  <span className="text-sm">Booked Slots</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-warning"></div>
                  <span className="text-sm">Pending Requests</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 5).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {format(event.start, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm font-medium mb-1">{event.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                        </p>
                        <Badge
                          className={`mt-2 text-xs ${
                            event.status === 'open'
                              ? 'bg-primary-light text-primary'
                              : event.status === 'booked'
                              ? 'bg-success-light text-success'
                              : 'bg-warning-light text-warning'
                          }`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      {event.status === 'open' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(event.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </motion.div>
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
 
export default AvailabilityPage;
