import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { X, Briefcase, Bookmark, PlusCircle } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const role = user?.role;

  const sidebarUserList = [
    { name: "All Jobs", sideLink: "/jobs", icon: Briefcase },
    { name: "Saved Jobs", sideLink: "/jobs/saved-jobs", icon: Bookmark },
  ];

  const sidebarAdminList = [
    { name: "All Jobs", sideLink: "/admin", icon: Briefcase },
    { name: "Post Jobs", sideLink: "/admin/post-job", icon: PlusCircle },
  ];

  const sidebarList = role === "admin" ? sidebarAdminList : sidebarUserList;

  return (
    <>
      <aside
        className={`
          fixed md:relative top-0 left-0 h-screen lg:h-[calc(100vh-60px)] w-60 bg-white z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
           
          ${isOpen ? "md:w-60" : "md:hidden"}
        `}
      >
        {/* Close button (mobile) */}
        <div className="flex justify-end p-3 md:hidden">
          <button onClick={onClose} className="text-black">
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="p-5 space-y-2">
          {sidebarList.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.sideLink}
                onClick={onClose}
                className="group flex items-center gap-3 px-3 py-2 rounded-lg
                           text-black font-medium
                           transition-all duration-300
                           hover:bg-white/10 hover:text-black"
              >
                <Icon
                  size={20}
                  className="transition-transform duration-300
                             group-hover:translate-x-1
                             group-hover:text-blue-400"
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
