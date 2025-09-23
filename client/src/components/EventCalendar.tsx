import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  mode?: "month" | "week";
  onModeChange?: (mode: "month" | "week") => void;
}

export default function EventCalendar({ events, onEventClick, mode = "month", onModeChange }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCalendarTitle = (date: Date) => {
    if (mode === "week") {
      const weekDays = getWeekDays();
      const startDate = weekDays[0];
      const endDate = weekDays[6];
      
      if (startDate.getMonth() === endDate.getMonth()) {
        // Same month
        return new Intl.DateTimeFormat('en-US', {
          month: 'long',
          year: 'numeric',
        }).format(startDate) + ` (Week of ${startDate.getDate()})`;
      } else {
        // Spans months
        return `${new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
        }).format(startDate)} - ${new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(endDate)}`;
      }
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getWeekdays = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  const getCalendarDays = () => {
    if (mode === "week") {
      return getWeekDays();
    }
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month  
    const lastDay = new Date(year, month + 1, 0);
    // Start of calendar grid (may include prev month days)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days) of calendar
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const days = [];
    const current = new Date(startOfWeek);
    
    // Generate 7 days for the week
    for (let i = 0; i < 7; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDay = (day: Date) => {
    // Use local date without timezone conversion
    const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    return events
      .filter(event => {
        const eventDate = new Date(event.startsAt);
        const eventDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
        return eventDateStr === dayStr;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (mode === "week") {
      // Navigate by week
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else {
      // Navigate by month
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const calendarDays = getCalendarDays();

  return (
    <Card className="w-full" data-testid="event-calendar">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl" data-testid="calendar-title">
            {getCalendarTitle(currentDate)}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onModeChange && (
              <>
                <div className="flex border border-border rounded-md overflow-hidden mr-2">
                  <Button
                    variant={mode === "month" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onModeChange("month")}
                    className="rounded-none border-0"
                    data-testid="calendar-mode-month"
                  >
                    Month
                  </Button>
                  <Button
                    variant={mode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onModeChange("week")}
                    className="rounded-none border-0 border-l border-border"
                    data-testid="calendar-mode-week"
                  >
                    Week
                  </Button>
                </div>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              data-testid={mode === "week" ? "button-prev-week" : "button-prev-month"}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              data-testid="button-today"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              data-testid={mode === "week" ? "button-next-week" : "button-next-month"}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-border">
          {getWeekdays().map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30 border-r border-border last:border-r-0"
              data-testid={`weekday-${day.toLowerCase()}`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-border last:border-r-0 ${
                  !isCurrentMonthDay ? 'bg-muted/20' : ''
                } ${isTodayDay ? 'bg-primary/5' : ''}`}
                data-testid={`calendar-day-${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    !isCurrentMonthDay
                      ? 'text-muted-foreground'
                      : isTodayDay
                      ? 'text-primary font-bold'
                      : 'text-foreground'
                  }`}
                >
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="cursor-pointer p-1 rounded text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      onClick={() => onEventClick?.(event)}
                      data-testid={`calendar-event-${event.id}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <Clock className="w-2 h-2 mr-1" />
                        {new Intl.DateTimeFormat('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        }).format(new Date(event.startsAt))}
                      </div>
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}