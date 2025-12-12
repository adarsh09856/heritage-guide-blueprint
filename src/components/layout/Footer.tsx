import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-sand section-pattern">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-serif text-2xl font-semibold">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <Globe className="w-5 h-5 text-foreground" />
              </div>
              <span>Heritage Guide</span>
            </Link>
            <p className="text-sand/70 leading-relaxed">
              Discover the world's most remarkable heritage sites through immersive virtual tours and expert-guided experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {[
                { label: 'Destinations', to: '/destinations' },
                { label: 'Virtual Tours', to: '/virtual-tours' },
                { label: 'Stories', to: '/stories' },
                { label: 'Experiences', to: '/experiences' },
                { label: 'Plan a Trip', to: '/trip-planner' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.to}
                    className="text-sand/70 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
                <li key={item}>
                  <a 
                    href="#"
                    className="text-sand/70 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-sand/70">
                  123 Heritage Lane<br />
                  Cultural District, World 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <a href="mailto:hello@heritageguide.com" className="text-sand/70 hover:text-gold transition-colors">
                  hello@heritageguide.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <a href="tel:+1234567890" className="text-sand/70 hover:text-gold transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sand/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sand/50 text-sm">
            © {currentYear} Heritage Guide. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-sand/50 hover:text-gold transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
