import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AvailabilityCalendar.css'; // Custom calendar styles

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Trash2, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { availabilityAPI } from '@/services/availabilityAPI';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

const AvailabilityPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [stats, setStats] = useState({ availableSlots: 0, bookedSlots: 0 });

  useEffect(() => {
    loadAvailability();
    loadStats();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await availabilityAPI.getMyAvailability();
      
      const formattedEvents = data.map(slot => ({
        id: slot.id,
        title: slot.description || (slot.status === 'BOOKED' ? 'Interview Scheduled' : 'Available'),
        start: new Date(slot.startDateTime),
        end: new Date(slot.endDateTime),
        status: slot.status.toLowerCase(),
        description: slot.description,
        interviewScheduleId: slot.interviewScheduleId
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      toast({
        title: 'Error loading availability',
        description: error.response?.data?.message || 'Failed to load your availability',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await availabilityAPI.getAvailabilityStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);

    if (start instanceof Date) {
      const isMonthViewClick = start.getHours() === 0 && start.getMinutes() === 0;
      
      let startDate = new Date(start);
      if (isMonthViewClick) {
        startDate.setHours(9, 0, 0, 0);
      }
      
      const end = new Date(startDate.getTime() + 60 * 60 * 1000);
      setStartTime(format(startDate, 'HH:mm'));
      setEndTime(format(end, 'HH:mm'));

      toast({
        title: 'Time range selected',
        description: `${format(startDate, 'MMM dd, yyyy')} • ${format(startDate, 'HH:mm')} - ${format(end, 'HH:mm')}`,
      });
    }
  };

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);
    
    const [startHour, startMin] = newStartTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes - startMinutes < 60) {
      const newEndHour = Math.floor((startMinutes + 60) / 60);
      const newEndMin = (startMinutes + 60) % 60;
      
      if (newEndHour < 19) {
        setEndTime(`${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`);
      }
    }
  };

  const handleEndTimeChange = (newEndTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = newEndTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
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

  const handleAddSlot = async () => {
    if (!selectedDate) {
      toast({
        title: 'No date selected',
        description: 'Please select a date on the calendar first',
        variant: 'destructive',
      });
      return;
    }

    const baseDate = new Date(selectedDate);
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // Create date objects with the selected time
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, startMin, 0, 0);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), endHour, endMin, 0, 0);

    try {
      const newSlot = await availabilityAPI.createAvailabilitySlot({
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        description: description || null
      });

      const newEvent = {
        id: newSlot.id,
        title: newSlot.description || 'Available',
        start: new Date(newSlot.startDateTime),
        end: new Date(newSlot.endDateTime),
        status: newSlot.status.toLowerCase(),
        description: newSlot.description
      };

      setEvents([...events, newEvent]);
      setSelectedDate(null);
      setStartTime('09:00');
      setEndTime('10:00');
      setDescription('');

      await loadStats();

      toast({
        title: 'Time slot added',
        description: `${format(start, 'MMM dd, yyyy')} • ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
      });
    } catch (error) {
      toast({
        title: 'Failed to add slot',
        description: error.response?.data?.message || 'This time slot may conflict with existing availability',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSlot = async (eventId) => {
    try {
      await availabilityAPI.deleteAvailabilitySlot(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      await loadStats();
      
      toast({
        title: 'Time slot deleted',
        description: 'The availability slot has been removed',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete slot',
        description: error.response?.data?.message || 'Cannot delete booked slots',
        variant: 'destructive',
      });
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#6366f1'; // primary blue
    let borderColor = '#4f46e5';
    
    if (event.status === 'booked') {
      backgroundColor = '#10b981'; // success green
      borderColor = '#059669';
    } else if (event.status === 'blocked') {
      backgroundColor = '#f59e0b'; // warning orange
      borderColor = '#d97706';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: `2px solid ${borderColor}`,
        display: 'block',
        padding: '4px 8px',
        fontSize: '13px',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    };
  };

  const timeSlots = [];
  for (let hour = 7; hour < 19; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    timeSlots.push(time);
  }

  const upcomingEvents = events
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

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
            className="gap-2 shadow-lg"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-lg border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Slots</p>
                    <p className="text-3xl font-bold text-primary mt-1">{stats.availableSlots}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border-success/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Booked Slots</p>
                    <p className="text-3xl font-bold text-success mt-1">{stats.bookedSlots}</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Clock className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border-secondary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                    <p className="text-3xl font-bold text-secondary mt-1">
                      {Math.round((stats.availableSlots + stats.bookedSlots) * 1.5)}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Availability Calendar
              </CardTitle>
              <CardDescription>
                Click on a date to add availability slots. Green slots are already booked for interviews.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="h-[650px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading calendar...</p>
                  </div>
                </div>
              ) : (
                <div className="availability-calendar-container h-[650px] bg-background rounded-xl p-5 border shadow-inner">
                  <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={handleSelectSlot}
                    selectable
                    eventPropGetter={eventStyleGetter}
                    style={{ height: '100%' }}
                    views={['month', 'week', 'day']}
                    defaultView="week"
                    step={60}
                    timeslots={1}
                    min={new Date(1970, 0, 1, 7, 0)}
                    max={new Date(1970, 0, 1, 19, 0)}
                    scrollToTime={new Date(1970, 0, 1, 8, 0)}
                    popup
                    showMultiDayTimes
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-lg">Add Availability Slot</CardTitle>
                <CardDescription>
                  Select time range when you're available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 py-2">
                  {selectedDate && (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
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
                <Button onClick={handleAddSlot} className="shadow-md">Add Slot</Button>
              </div>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6366f1' }}></div>
                  <span className="text-sm">Available Slots</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
                  <span className="text-sm">Booked Slots</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="text-sm">Blocked Slots</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming slots
                    </p>
                  ) : (
                    upcomingEvents.map((event) => (
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
                              event.status === 'available'
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : event.status === 'booked'
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                            }`}
                            variant="outline"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        {event.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSlot(event.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </motion.div>
                    ))
                  )}
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