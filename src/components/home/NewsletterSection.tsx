import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    toast({
      title: 'Subscribed!',
      description: 'Welcome to Heritage Guide newsletter.'
    });
    
    setIsSubmitting(false);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-forest to-earth relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10 section-pattern" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand/10 mb-6">
            <Mail className="w-8 h-8 text-gold" />
          </div>
          
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-sand mb-4">
            Stay Updated with Heritage Guide
          </h2>
          <p className="text-sand/80 mb-8">
            Get weekly curated stories, new virtual tours, and exclusive travel tips delivered to your inbox.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-3 text-gold">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">You're subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-sand/10 border-sand/20 text-sand placeholder:text-sand/50"
              />
              <Button 
                type="submit" 
                variant="gold" 
                disabled={isSubmitting}
                className="shrink-0"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          <p className="text-sand/60 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
