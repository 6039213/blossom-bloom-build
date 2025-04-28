
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      quote: "Blossom completely transformed our website creation process. What would have taken weeks now takes hours, and the results are even better!",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "GrowthLabs",
      avatar: "/placeholder.svg",
      stars: 5
    },
    {
      quote: "The AI capabilities are mind-blowing. I described my dream website, and Blossom created it exactly as I imagined. No technical skills needed!",
      author: "Michael Chen",
      role: "Entrepreneur",
      company: "TechStart Inc.",
      avatar: "/placeholder.svg",
      stars: 5
    },
    {
      quote: "We've tried many website builders, but Blossom stands out with its intuitive interface and powerful AI. Our team loves how easy it is to use.",
      author: "Emily Rodriguez",
      role: "Design Lead",
      company: "CreativeEdge",
      avatar: "/placeholder.svg",
      stars: 5
    },
  ];
  
  const nextTestimonial = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-16 md:py-24 relative">
      {/* Decorative elements */}
      <div className="hidden lg:block absolute top-1/3 left-10 w-48 h-48 bg-blossom-500/10 rounded-full blur-3xl" />
      <div className="hidden lg:block absolute bottom-1/4 right-10 w-64 h-64 bg-blossom-500/10 rounded-full blur-3xl" />
      
      <div className="container max-w-screen-xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Creators Worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied users building amazing websites with Blossom
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full px-4"
                >
                  <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 md:p-12 shadow-blossom border border-blossom-200 dark:border-blossom-800/30 relative">
                    <Quote className="absolute top-6 left-6 w-10 h-10 text-blossom-200 dark:text-blossom-800/30 opacity-50" />
                    
                    <div className="flex justify-center mb-8">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-blossom-500 fill-blossom-500" />
                      ))}
                    </div>
                    
                    <p className="text-xl md:text-2xl text-center mb-8 italic relative z-10">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-blossom-200 dark:border-blossom-800/30">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full border border-blossom-200 dark:border-blossom-800/30"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-blossom-500 w-6' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full border border-blossom-200 dark:border-blossom-800/30"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
