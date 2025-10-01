import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Utensils, 
  Coffee, 
  Heart, 
  Users, 
  ChefHat, 
  Clock,
  Salad,
  Wine,
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function Dining() {
  useEffect(() => {
    document.title = "Dining & Restaurant Services | Senior Living Communities";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Experience exceptional restaurant-style dining and private family dining rooms at our senior living communities. Fresh, nutritious meals prepared daily with dietary accommodations and social dining experiences.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Experience exceptional restaurant-style dining and private family dining rooms at our senior living communities. Fresh, nutritious meals prepared daily with dietary accommodations and social dining experiences.';
      document.head.appendChild(meta);
    }
  }, []);

  // Sample weekly menu data
  const weeklyMenu = {
    monday: {
      breakfast: "Belgian Waffles with Fresh Berry Compote",
      lunch: "Grilled Salmon Caesar Salad with Garlic Croutons",
      dinner: "Herb-Crusted Prime Rib with Roasted Vegetables"
    },
    tuesday: {
      breakfast: "Denver Omelet with Hash Browns",
      lunch: "Tuscan Chicken Sandwich with Tomato Bisque",
      dinner: "Pan-Seared Sea Bass with Lemon Butter Sauce"
    },
    wednesday: {
      breakfast: "French Toast with Caramelized Bananas",
      lunch: "Asian Chicken Salad with Sesame Ginger Dressing",
      dinner: "Beef Tenderloin with Red Wine Reduction"
    },
    thursday: {
      breakfast: "Eggs Benedict with Hollandaise Sauce",
      lunch: "Mediterranean Wrap with Greek Yogurt Sauce",
      dinner: "Roasted Cornish Hen with Wild Rice Pilaf"
    },
    friday: {
      breakfast: "Blueberry Pancakes with Maple Syrup",
      lunch: "Shrimp Scampi over Angel Hair Pasta",
      dinner: "Grilled Lamb Chops with Mint Chimichurri"
    }
  };

  const dietaryAccommodations = [
    { icon: Heart, title: "Heart-Healthy Options", description: "Low-sodium, low-fat meals for cardiovascular health" },
    { icon: Salad, title: "Vegetarian & Vegan", description: "Plant-based options prepared with care and creativity" },
    { icon: CheckCircle, title: "Gluten-Free Choices", description: "Safe and delicious options for gluten sensitivities" },
    { icon: Sparkles, title: "Texture-Modified", description: "Pureed and soft foods that maintain flavor and nutrition" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PageHero
        pagePath="/dining"
        defaultTitle="Exceptional Dining Experiences"
        defaultSubtitle="Restaurant-Style Service • Fresh Daily • Social Connection"
        defaultBackgroundImage="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=2000&q=80"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb data-testid="breadcrumb-navigation">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" data-testid="breadcrumb-home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage data-testid="breadcrumb-current">Dining Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Restaurant-Style Dining Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Utensils className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Restaurant-Style Dining</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Experience the pleasure of dining in our elegant restaurant-style dining rooms, where every meal is a special occasion. Our professional waitstaff provides attentive service while you enjoy chef-prepared meals in a sophisticated setting.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Multiple Menu Options Daily</h4>
                    <p className="text-muted-foreground">Choose from various entrées, sides, and desserts for every meal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Dining Times</h4>
                    <p className="text-muted-foreground">Extended hours accommodate different schedules and preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Table Service</h4>
                    <p className="text-muted-foreground">Professional waitstaff ensures a comfortable dining experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" 
                alt="Elegant restaurant-style dining room with beautifully set tables"
                className="w-full h-full object-cover"
                data-testid="restaurant-dining-image"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1" />
                  Fine Dining Daily
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Family Dining Room Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" 
                alt="Private dining room for family gatherings"
                className="w-full h-full object-cover"
                data-testid="private-dining-image"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary text-white px-4 py-2 text-sm font-semibold">
                  <Users className="w-4 h-4 mr-1" />
                  Family Gatherings
                </Badge>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Wine className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Private Family Dining Room</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Celebrate life's special moments in our private dining rooms. Perfect for family birthdays, anniversaries, holidays, or intimate gatherings with loved ones in a comfortable, private setting.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Reserve for Special Occasions</h4>
                    <p className="text-muted-foreground">Book our private space for birthdays, anniversaries, and celebrations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Customized Menus</h4>
                    <p className="text-muted-foreground">Work with our chef to create a personalized menu for your event</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Intimate Setting</h4>
                    <p className="text-muted-foreground">Seats up to 12 guests in a beautifully appointed private space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Menu Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Sample Weekly Menu</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our culinary team prepares fresh, flavorful meals daily using seasonal ingredients. 
              Here's a taste of what you can expect from our diverse menu options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Object.entries(weeklyMenu).map(([day, meals]) => (
              <Card key={day} className="hover:shadow-lg transition-shadow duration-300" data-testid={`menu-card-${day}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg capitalize flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Coffee className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold text-orange-600">Breakfast</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meals.breakfast}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Salad className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Lunch</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meals.lunch}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-700">Dinner</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meals.dinner}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            <span className="font-semibold">Note:</span> Menus rotate weekly and feature seasonal specialties. 
            Alternative options are always available.
          </p>
        </div>
      </section>

      {/* Dietary Accommodations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dietary Accommodations & Nutrition
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our registered dietitians work closely with our culinary team to ensure every resident's 
              dietary needs and preferences are met with delicious, nutritious options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dietaryAccommodations.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300" data-testid={`dietary-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-lg mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 bg-primary/5 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Personalized Nutrition Plans</h3>
                <p className="text-muted-foreground mb-4">
                  Our on-site registered dietitian provides personalized nutrition assessments and meal planning 
                  to support each resident's health goals and dietary requirements.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Individual nutrition consultations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Specialized therapeutic diets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Weight management support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">Hydration monitoring</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80" 
                  alt="Fresh, nutritious ingredients and healthy meals"
                  className="w-full h-full object-cover"
                  data-testid="nutrition-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Dining Experience Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                More Than a Meal — A Social Experience
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Dining is one of life's great pleasures, and at our communities, it's also an opportunity 
                for meaningful social connections. Our dining rooms are vibrant gathering places where 
                friendships flourish over shared meals.
              </p>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Community Tables</h4>
                        <p className="text-sm text-muted-foreground">
                          Join friends at community tables or dine with new acquaintances in our welcoming dining rooms.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-secondary">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Themed Dining Events</h4>
                        <p className="text-sm text-muted-foreground">
                          Enjoy special themed dinners, holiday celebrations, and chef's table events throughout the year.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-accent">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <Coffee className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-2">Café & Bistro</h4>
                        <p className="text-sm text-muted-foreground">
                          Relax in our café for coffee, pastries, and light snacks throughout the day with neighbors and guests.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" 
                alt="Residents enjoying meals together in a warm, social dining atmosphere"
                className="w-full h-full object-cover"
                data-testid="social-dining-image"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-xl font-semibold mb-2">Where Every Meal is Shared</h3>
                  <p className="text-sm text-white/90">Building community one meal at a time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience Our Culinary Excellence
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join us for a complimentary meal and discover why our residents look forward to every dining experience. 
            Tour our dining facilities and meet our culinary team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="font-semibold"
              data-testid="button-schedule-tour"
              asChild
            >
              <Link href="/contact">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Tour & Meal
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="font-semibold bg-white/10 border-white text-white hover:bg-white/20"
              data-testid="button-view-communities"
              asChild
            >
              <Link href="/communities">
                View Our Communities
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6" />
              <span>Professional Culinary Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              <span>Heart-Healthy Options</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>Flexible Dining Hours</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}