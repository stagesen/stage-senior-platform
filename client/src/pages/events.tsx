import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Filter, List, Grid } from "lucide-react";
import EventCard from "@/components/EventCard";
import EventCalendar from "@/components/EventCalendar";
import EventDetailsModal from "@/components/EventDetailsModal";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/PageHero";
import type { Event, Community } from "@shared/schema";

export default function Events() {
  const [location] = useLocation();
  const [selectedCommunity, setSelectedCommunity] = useState("all");
  const [timeFilter, setTimeFilter] = useState("upcoming");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [calendarMode, setCalendarMode] = useState<"month" | "week">("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Handle URL query parameters for initial community selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const communityParam = searchParams.get('community');
    if (communityParam) {
      setSelectedCommunity(communityParam);
    }
  }, [location]);

  const { data: allCommunities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  // Filter communities to only show active ones
  const communities = allCommunities.filter(community => community.active !== false);

  const { data: allEvents = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Filter events based on community selection and public visibility
  const events = allEvents.filter((event) => {
    // Only show public events
    if (!event.isPublic) return false;
    
    // Filter by selected community
    if (selectedCommunity !== "all" && event.communityId !== selectedCommunity) {
      return false;
    }
    
    return true;
  });

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.startsAt);
    
    if (timeFilter === "upcoming") {
      return eventDate >= now;
    } else if (timeFilter === "past") {
      return eventDate < now;
    }
    return true;
  });

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.startsAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  return (
    <div>
      {/* Hero Section */}
      <PageHero
        pagePath="/events"
        defaultTitle="Community Events & Programming"
        defaultSubtitle="Experience meaningful activities and social connections at Stage Senior communities"
        defaultBackgroundImage="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=2000&q=80"
      />

      {/* Filters */}
      <section className="bg-card py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* View Toggle */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">View:</label>
                <div className="flex border border-border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0"
                    data-testid="view-list"
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className="rounded-none border-0 border-l border-border"
                    data-testid="view-calendar"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Calendar
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="community-filter" className="text-sm font-medium text-foreground">
                  Community:
                </label>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger className="w-48" id="community-filter" data-testid="select-community">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    {communities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="time-filter" className="text-sm font-medium text-foreground">
                  Time:
                </label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32" id="time-filter" data-testid="select-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Events Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Skeleton className="h-48 md:h-32" />
                        <div className="md:col-span-3 space-y-4">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-16 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === "calendar" ? (
              <EventCalendar 
                events={filteredEvents} 
                onEventClick={setSelectedEvent}
                mode={calendarMode}
                onModeChange={setCalendarMode}
              />
            ) : Object.keys(groupedEvents).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedEvents)
                  .sort(([dateA], [dateB]) => {
                    const a = new Date(dateA);
                    const b = new Date(dateB);
                    return timeFilter === "past" ? b.getTime() - a.getTime() : a.getTime() - b.getTime();
                  })
                  .map(([date, dateEvents]) => (
                    <div key={date} className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold text-foreground" data-testid={`date-header-${date}`}>
                          {new Intl.DateTimeFormat('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(date))}
                        </h2>
                        <Badge variant="outline" className="text-xs" data-testid={`event-count-${date}`}>
                          {dateEvents.length} event{dateEvents.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {dateEvents
                          .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
                          .map((event) => (
                            <EventCard key={event.id} event={event} />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2" data-testid="no-events-title">
                    No Events Found
                  </h3>
                  <p className="text-muted-foreground" data-testid="no-events-description">
                    {timeFilter === "upcoming" 
                      ? "No upcoming events are scheduled at this time."
                      : timeFilter === "past"
                      ? "No past events found."
                      : "No events found matching your criteria."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" data-testid="stats-title">Event Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center" data-testid="total-events">
                    <span className="text-sm text-muted-foreground">Total Events</span>
                    <span className="font-semibold">{events.length}</span>
                  </div>
                  <div className="flex justify-between items-center" data-testid="upcoming-events">
                    <span className="text-sm text-muted-foreground">Upcoming</span>
                    <span className="font-semibold">
                      {events.filter(e => new Date(e.startsAt) >= new Date()).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center" data-testid="communities-with-events">
                    <span className="text-sm text-muted-foreground">Communities</span>
                    <span className="font-semibold">
                      {new Set(events.map(e => e.communityId).filter(Boolean)).size}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="contact-title">
                    Questions About Events?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="contact-description">
                    Contact us to learn more about upcoming events or to schedule a visit.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-contact"
                  >
                    <a href="tel:+1-303-436-2300">
                      Call (303) 436-2300
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </main>

      {/* Event Details Modal */}
      <EventDetailsModal 
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
