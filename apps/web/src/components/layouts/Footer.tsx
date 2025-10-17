import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-secondary py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Stayra</h3>
            <p className="opacity-90 leading-relaxed">
              Experience luxury and comfort at its finest. Your perfect stay awaits.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 opacity-90">
              <li>
                <a href="#home" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-accent transition-colors">
                  Rooms
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 opacity-90">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Room Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Spa & Wellness
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Fine Dining
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Concierge
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center opacity-90">
          <p>&copy; 2025 Stayra Luxury Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer;