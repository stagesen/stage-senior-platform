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
    name: "Resident's Son",
    relation: "Son of Resident",
    community: "Stonebridge Senior",
    rating: 5,
    text: "The Stonebridge staff are an extremely professional care team and has the best management a family could ask for (which is almost unheard of in this industry)!!",
    highlight: "The best management a family could ask for",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
  },
  {
    id: 2,
    name: "Family Member",
    relation: "Daughter of Resident",
    community: "Stonebridge Senior",
    rating: 5,
    text: "My father has made some great friends, loves the meals, and raves about the activities. The seniors have structure here and a bustling social life – if they choose to. We are so blessed to have found Stonebridge for his new home.",
    highlight: "We are so blessed to have found Stonebridge",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
  },
  {
    id: 3,
    name: "Resident Family",
    relation: "Family of Resident",
    community: "Golden Pond",
    rating: 5,
    text: "Golden Pond has exceeded our expectations in every way. With over 98% resident satisfaction, it's clear why families trust them. The continuity of care means our loved one can stay here through all stages of aging.",
    highlight: "Exceeded our expectations in every way",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
  },
  {
    id: 4,
    name: "Family Member",
    relation: "Family of Resident",
    community: "The Gardens at Columbine",
    rating: 5,
    text: "The staff here are so kind and courteous. The community and grounds are absolutely lovely. Many staff members have been here since the community opened, which shows how much they care. It truly feels like family.",
    highlight: "It truly feels like family",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
  },
  {
    id: 5,
    name: "Resident's Family",
    relation: "Family of Memory Care Resident",
    community: "The Gardens at Columbine",
    rating: 5,
    text: "The memory care building is one of the most beautiful and thoughtfully designed memory care communities in the state. The 2 acres of gardens with water features provide such a therapeutic environment for our loved one.",
    highlight: "The most beautiful and thoughtfully designed",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
  },
  {
    id: 6,
    name: "Family Member",
    relation: "Family of Resident",
    community: "The Gardens on Quail",
    rating: 5,
    text: "The intergenerational programs and community partnerships make this place special. Residents regularly engage with local schools, churches, and businesses. It's not just a place to live – it's truly part of the Arvada community.",
    highlight: "Truly part of the Arvada community",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    date: "Recent"
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