import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, User, LogOut, Settings, Users, LayoutDashboard } from "lucide-react";
import { cn } from "./ui/utils";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  type?: "student" | "admin";
}

export function Sidebar({ type = "student" }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const studentLinks = [
    { to: "/dashboard", icon: Home, label: "لوحة التحكم" },
    { to: "/courses", icon: BookOpen, label: "تصفح الكورسات" },

  ];

  const adminLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "لوحة التحكم" },
    { to: "/admin/courses", icon: BookOpen, label: "الكورسات" },
    { to: "/admin/students", icon: Users, label: "الطلاب" },
    { to: "/admin/settings", icon: Settings, label: "الإعدادات" },
  ];

  const links = type === "admin" ? adminLinks : studentLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="h-screen bg-card border-l border-border w-64 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to={type === "admin" ? "/admin" : "/dashboard"}>
          <h2 className="text-2xl text-primary">DOSYA</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {type === "admin" ? "لوحة الإدارة" : "منصة التعلم الإلكتروني"}
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
