import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  relation: string;
  community: string;
  rating: number;
  text: string;
  imageUrl: string;
  date: string;
  highlight?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    relation: "Daughter of Resident",
    community: "The Gardens at Columbine",
    rating: 5,
    text: "The care my mother receives here goes beyond what I ever expected. The staff knows her by name, her favorite foods, and even her favorite TV shows. It truly feels like she's found a new family, not just a place to live.",
    highlight: "It truly feels like she's found a new family",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Robert & Linda Thompson",
    relation: "Residents",
    community: "Golden Pond",
    rating: 5,
    text: "We've been here for 3 years now, and it's the best decision we ever made. The transparent pricing means no surprises, and the activities keep us engaged every day. We've made more friends here than we had in our old neighborhood!",
    highlight: "The best decision we ever made",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Michael Chen",
    relation: "Son of Resident",
    community: "The Gardens on Quail",
    rating: 5,
    text: "Dad was resistant to moving at first, but the Your Story First® approach won him over. They took time to learn about his engineering background and now he leads a weekly tech discussion group. He's happier than he's been in years.",
    highlight: "He's happier than he's been in years",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
    date: "3 weeks ago"
  },
  {
    id: 4,
    name: "Patricia Williams",
    relation: "Daughter of Resident",
    community: "Stonebridge Senior",
    rating: 5,
    text: "The memory care program here is exceptional. Even as Mom's condition has progressed, the staff adapts with such patience and creativity. The small moments of joy they create for her mean everything to our family.",
    highlight: "Small moments of joy mean everything",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
    date: "1 week ago"
  },
  {
    id: 5,
    name: "James Anderson",
    relation: "Resident",
    community: "The Gardens at Columbine",
    rating: 5,
    text: "As a veteran, finding a community that understands service and camaraderie was important to me. Stage Senior has exceeded every expectation. The staff here treats everyone with dignity and respect.",
    highlight: "Exceeded every expectation",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop",
    date: "2 months ago"
  }
];

export default function TestimonialSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    updateCurrent();

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !autoPlay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoPlay]);

  const scrollPrev = () => {
    api?.scrollPrev();
    setAutoPlay(false);
  };

  const scrollNext = () => {
    api?.scrollNext();
    setAutoPlay(false);
  };

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-semibold">Real Stories from Real Families</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Why families choose Stage Senior
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear directly from residents and families
            who've experienced the Stage Senior difference.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.8</div>
              <div className="flex items-center gap-1 justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/50 text-yellow-400/50'}`} />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Happy Families</div>
            </div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "center",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className={`transition-all duration-500 ${
                    current === index ? 'scale-105' : 'scale-95 opacity-75'
                  }`}>
                    <Card className="h-full hover:shadow-2xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">{testimonial.date}</span>
                        </div>

                        {/* Quote Icon */}
                        <Quote className="w-10 h-10 text-primary/20 mb-3" />

                        {/* Testimonial Text */}
                        <p className="text-foreground leading-relaxed mb-6 flex-grow">
                          {testimonial.text}
                        </p>

                        {/* Highlight */}
                        {testimonial.highlight && (
                          <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg mb-6 font-semibold text-center">
                            "{testimonial.highlight}"
                          </div>
                        )}

                        {/* Author */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                          <img
                            src={testimonial.imageUrl}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-grow">
                            <div className="font-semibold text-foreground">{testimonial.name}</div>
                            <div className="text-sm text-muted-foreground">{testimonial.relation}</div>
                            <div className="text-xs text-primary">{testimonial.community}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-10 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 z-10 group"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 ${
                current === index
                  ? 'w-8 h-2 bg-primary rounded-full'
                  : 'w-2 h-2 bg-primary/30 rounded-full hover:bg-primary/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Join hundreds of happy families
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Experience the Stage Senior difference for yourself. Schedule a tour today and see why families trust us with their loved ones.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Schedule a Tour
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Read More Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}