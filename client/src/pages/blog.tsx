import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, User, ArrowLeft } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import BlogCommunityCTA from "@/components/BlogCommunityCTA";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { PageHero } from "@/components/PageHero";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import type { BlogPost, Community } from "@shared/schema";

export default function Blog() {
  const params = useParams();
  const postSlug = params.slug;
  
  // Read community filter from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const communityParam = urlParams.get('community');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(communityParam || "all");
  const [selectedTag, setSelectedTag] = useState("all");

  const { data: communities = [] } = useQuery<Community[]>({
    queryKey: ["/api/communities?active=true"],
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts?published=true"],
  });

  const { data: currentPost, isLoading: postLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${postSlug}`],
    enabled: !!postSlug,
  });

  // Resolve main image URL for current post
  const resolvedMainImage = useResolveImageUrl(currentPost?.mainImage);

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort();

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCommunity = selectedCommunity === "all" || 
      post.communityId === selectedCommunity;
    
    const matchesTag = selectedTag === "all" || 
      post.tags?.includes(selectedTag);

    return matchesSearch && matchesCommunity && matchesTag;
  });

  // If viewing a specific post
  if (postSlug) {
    if (postLoading) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      );
    }

    if (!currentPost) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="post-not-found-title">
                Post Not Found
              </h1>
              <p className="text-muted-foreground mb-6" data-testid="post-not-found-description">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild data-testid="button-back-blog">
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const community = communities.find(c => c.id === currentPost.communityId);

    return (
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              className="mb-6" 
              asChild
              data-testid="button-back-to-blog"
            >
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            
            <div className="space-y-4">
              {currentPost.tags && currentPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" data-testid={`post-tag-${tag}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground" data-testid="post-title">
                {currentPost.title}
              </h1>
              
              {currentPost.authorDetails && (
                <div className="text-lg text-muted-foreground">
                  By{" "}
                  <Link 
                    href={`/team/${currentPost.authorDetails.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    data-testid="post-author-link"
                  >
                    {currentPost.authorDetails.name}
                  </Link>
                </div>
              )}
              
              {currentPost.summary && (
                <p className="text-xl text-muted-foreground" data-testid="post-summary">
                  {currentPost.summary}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center" data-testid="post-date">
                  <Calendar className="w-4 h-4 mr-2" />
                  {currentPost.publishedAt ? 
                    new Date(currentPost.publishedAt).toLocaleDateString() :
                    new Date(currentPost.createdAt || new Date()).toLocaleDateString()
                  }
                </div>
                {community && (
                  <div className="flex items-center" data-testid="post-community">
                    <User className="w-4 h-4 mr-2" />
                    {community.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Post Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="prose prose-lg max-w-none" data-testid="post-content">
            {resolvedMainImage && (
              <img
                src={resolvedMainImage}
                alt={currentPost.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
                data-testid="post-hero-image"
              />
            )}
            
            <div
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
              className="prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
            />
          </article>

          {/* Community CTA - Only show if post is associated with a community */}
          {currentPost.communityId && community && (
            <BlogCommunityCTA community={community} />
          )}
        </main>
      </div>
    );
  }

  // Blog listing page
  return (
    <div>
      <PageHero
        pagePath="/blog"
        defaultTitle="Blog & News"
        defaultSubtitle="Stories from Our Communities"
        defaultBackgroundImage="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=2000&q=80"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="blog-title">
              Senior Living <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="blog-description">
              Stay informed with the latest insights, tips, and stories from our senior living communities. 
              Discover resources for families and learn about life in our communities.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card py-6 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                data-testid="input-search"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Community Filter */}
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger data-testid="select-community">
                <SelectValue placeholder="All Communities" />
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

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger data-testid="select-tag">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCommunity("all");
                setSelectedTag("all");
              }}
              data-testid="button-clear-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Posts List */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground" data-testid="results-count">
                {filteredPosts.length} Post{filteredPosts.length !== 1 ? 's' : ''} Found
              </h2>
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    community={communities.find(c => c.id === post.communityId)}
                    onTagClick={(tag) => setSelectedTag(tag)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-foreground mb-2" data-testid="no-posts-title">
                    No Posts Found
                  </h3>
                  <p className="text-muted-foreground" data-testid="no-posts-description">
                    No blog posts found matching your criteria. Try adjusting your filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" data-testid="popular-tags-title">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 10).map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTag(tag)}
                        data-testid={`tag-${tag}`}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg" data-testid="recent-posts-title">Recent Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <Link href={`/blog/${post.slug}`} className="group">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1" data-testid={`recent-post-${post.slug}`}>
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {post.publishedAt ? 
                            new Date(post.publishedAt).toLocaleDateString() :
                            new Date(post.createdAt || new Date()).toLocaleDateString()
                          }
                        </p>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid="newsletter-title">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="newsletter-description">
                    Subscribe to get the latest blog posts and updates from our communities.
                  </p>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-subscribe"
                  >
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
