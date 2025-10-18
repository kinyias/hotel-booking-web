import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageTitleProps {
  title: string;
  breadcrumbs: { label: string; href: string }[];
  description?: string;
}

const PageTitle = ({ title, breadcrumbs, description }: PageTitleProps) => {
  return (
    <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(/images/page-title-bg.png)` }} />
      
      <div className="relative z-10 text-center px-4 pt-15">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-bold">
          {title}
        </h1>
        {description ? (
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8">
            {description}
          </p>
        ): (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className={`flex items-center gap-2 ${index !== breadcrumbs.length - 1 ? 'text-primary' : ''}`}>
              <Link 
                href={crumb.href} 
                className="hover:text-gold transition-colors"
              >
                {crumb.label}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};

export default PageTitle;
