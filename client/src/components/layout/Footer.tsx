import { Building2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 sm:ml-64 w-full bg-white border-t border-neutral-200 py-4 px-6 z-50">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <Building2 className="h-5 w-5 text-primary-600 mr-2" />
          <span className="text-sm text-neutral-600">
            ConnectCRM &copy; {currentYear}
          </span>
        </div>

        <div className="text-sm text-neutral-500">
          <span>Version 1.0.0 | </span>
          <a
            href="#"
            className="text-primary-600 hover:text-primary-800 transition-colors"
          >
            Privacy Policy
          </a>
          <span> | </span>
          <a
            href="#"
            className="text-primary-600 hover:text-primary-800 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;