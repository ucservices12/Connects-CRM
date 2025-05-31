import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, CheckCircle } from "lucide-react";
import GoogleLoginButton from "../pages/auth/GoogleLoginButton";
import FacebookLoginButton from "../pages/auth/FacebookLoginButton";

export const PublicNavbar = () => {
  const Navigate = useNavigate()
  const handleRemoveLoacalstorage = () => {
    localStorage.removeItem("CognitoIdentityServiceProvider");
    Navigate('/login');
    window.location.reload();
  };

  return (
    <div className='relative flex justify-between items-center top-0 border-b-2 px-3 pb-2'>
      <BarChart3 size={34} className="text-primary-800" />
      <div>
        <h5 className='text-lg'>Welcome</h5>
        {
          localStorage.getItem("CognitoIdentityServiceProvider") && <button className="text-blue-800 font-semibold" onClick={handleRemoveLoacalstorage}>Logout</button>
        }
      </div>
    </div>
  )
}

const features = [
  {
    title: "Employee Management",
    desc: "Manage your entire workforce efficiently",
    icon: <CheckCircle className="text-[#99BC85]" />,
  },
  {
    title: "Task Management",
    desc: "Organize work with Kanban boards and task tracking",
    icon: <CheckCircle className="text-[#99BC85]" />,
  },
  {
    title: "Lead Management",
    desc: "Track and nurture client relationships",
    icon: <CheckCircle className="text-[#99BC85]" />,
  },
  {
    title: "Advanced Reporting",
    desc: "Gain insights with detailed analytics",
    icon: <CheckCircle className="text-[#99BC85]" />,
  },
];

const AuthLayout = () => {
  const { pathname } = useLocation();

  const isAuthHeaderVisible = ["login", "register"].some((str) =>
    pathname.includes(str)
  );

  return (
    <div className="min-h-screen bg-[#1D1616] flex flex-col md:flex-row">
      {/* Left (Mobile Logo + Auth Form via Outlet) */}
      <div className="w-full md:w-1/2">
        <div className="animate-fade-in bg-white sm:h-screen p-6 rounded-xl m-3">
          <PublicNavbar />
          <div className='max-w-[350px] mx-auto flex justify-center flex-col'>
            {isAuthHeaderVisible && (
              <>
                <div className="flex justify-center mb-5">
                  <BarChart3 size={48} className="text-primary-800" />
                </div>

                {/* Auth Navigation Buttons */}
                <div className="flex justify-center items-center mb-6 gap-4">
                  <Link
                    to="/login"
                    className={`text-sm px-4 py-2 rounded-md font-semibold ${pathname === "/login"
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className={`text-sm px-4 py-2 rounded-md font-semibold ${pathname === "/register"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-blue-50"
                      }`}
                  >
                    Create Account
                  </Link>
                </div>

                {/* Social Logins */}
                <div className="grid gap-3 w-full">
                  <GoogleLoginButton />
                  {/* <FacebookLoginButton /> */}
                </div>

                <div className="w-full border-b pt-3" />
                <span className="text-gray-800 font-medium text-xs text-center my-4">OR</span>
              </>
            )}

            <Outlet />
          </div>
        </div>
      </div>

      {/* Right (Brand Info & Features for md+) */}
      <div className="hidden sm:flex md:w-1/2 bg-[#27548A] text-white flex-col justify-center items-center p-10">
        <div className="max-w-md">
          {/* Logo & App Name */}
          <div className="sm:flex hidden gap-2 items-center mb-6">
            <BarChart3 size={32} className="text-[#99BC85]" />
            <span className="text-3xl font-semibold">ConnectCRM</span>
          </div>

          {/* Description */}
          <p className="text-md mb-8 text-neutral-300">
            CRM is the ultimate all-in-one super app for businesses, streamlining HR, recruitment, tasks, goals, sales, marketing, appraisal, and finance. Say goodbye to multiple platforms, enjoy convenience in one place.
          </p>

          {/* Feature List */}
          <div className="space-y-5 text-left">
            {features.map(({ title, desc, icon }) => (
              <div className="flex items-start gap-3" key={title}>
                {icon}
                <div>
                  <h5 className="font-medium">{title}</h5>
                  <p className="text-sm text-neutral-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
