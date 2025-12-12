import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Globe, Users, Award, Target, Heart, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Heritage Sites', value: '1,000+', icon: Globe },
    { label: 'Virtual Tours', value: '500+', icon: Award },
    { label: 'Monthly Visitors', value: '2M+', icon: Users },
    { label: 'Countries Covered', value: '150+', icon: Target },
  ];

  const timeline = [
    { year: '2020', title: 'Founded', description: 'Heritage Guide was born from a passion to make cultural heritage accessible to everyone.' },
    { year: '2021', title: 'Virtual Tours Launch', description: 'Introduced immersive 360° virtual tours of UNESCO World Heritage Sites.' },
    { year: '2022', title: 'Global Expansion', description: 'Expanded coverage to over 100 countries with local expert partnerships.' },
    { year: '2023', title: 'AI Trip Planner', description: 'Launched AI-powered personalized heritage journey planning.' },
    { year: '2024', title: 'Community Features', description: 'Introduced user stories, bookmarks, and community-driven content.' },
  ];

  const values = [
    { icon: Globe, title: 'Preservation', description: 'We believe in preserving cultural heritage for future generations through awareness and education.' },
    { icon: Heart, title: 'Accessibility', description: 'Making world heritage accessible to everyone, regardless of physical or geographical limitations.' },
    { icon: Shield, title: 'Authenticity', description: 'Providing accurate, verified information from historians, archaeologists, and local experts.' },
    { icon: Users, title: 'Community', description: 'Building a global community of heritage enthusiasts who share their knowledge and experiences.' },
  ];

  const team = [
    { name: 'Dr. Sarah Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
    { name: 'Ahmed Al-Rashid', role: 'Head of Research', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { name: 'Maria Santos', role: 'Director of Content', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
    { name: 'James Wilson', role: 'CTO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Heritage Guide - Our Mission & Story</title>
        <meta name="description" content="Learn about Heritage Guide's mission to make world heritage accessible to everyone through virtual tours, stories, and expert-curated content." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-earth/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Preserving Heritage, <br />One Story at a Time
              </h1>
              <p className="text-muted-foreground text-lg">
                We're on a mission to make the world's cultural and natural heritage accessible to everyone, 
                fostering appreciation and preservation through technology and storytelling.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-6 bg-background rounded-xl shadow-heritage-sm">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-gold" />
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-gold font-medium tracking-wide uppercase text-sm">Our Mission</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Making Heritage Accessible to All
                </h2>
                <p className="text-muted-foreground mb-4">
                  Heritage Guide was founded with a simple but powerful vision: to ensure that the world's 
                  cultural and natural treasures are accessible to everyone, everywhere.
                </p>
                <p className="text-muted-foreground mb-4">
                  Through immersive virtual tours, expert-curated content, and AI-powered trip planning, 
                  we're breaking down barriers and bringing heritage sites to life for millions of people 
                  who might never have the opportunity to visit them in person.
                </p>
                <p className="text-muted-foreground">
                  But we're more than just a platform—we're a community of passionate heritage enthusiasts, 
                  historians, archaeologists, and travelers united by a shared love for the stories that 
                  connect us to our past and inspire our future.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600"
                  alt="Colosseum"
                  className="rounded-2xl shadow-heritage-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-gold text-foreground p-6 rounded-xl shadow-lg">
                  <p className="text-2xl font-bold">10+</p>
                  <p className="text-sm">Years of Expertise</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold font-medium tracking-wide uppercase text-sm">Our Values</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                What We Stand For
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="bg-background p-6 rounded-xl shadow-heritage-sm">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold font-medium tracking-wide uppercase text-sm">Our Journey</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                A Timeline of Growth
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-8">
                  {timeline.map((item, index) => (
                    <div key={item.year} className="relative flex gap-6">
                      <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-foreground font-bold text-sm shrink-0 z-10">
                        {item.year}
                      </div>
                      <div className="pt-3">
                        <h3 className="font-serif text-xl font-semibold mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-gold font-medium tracking-wide uppercase text-sm">Our Team</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                Meet the People Behind Heritage Guide
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-heritage-md"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
