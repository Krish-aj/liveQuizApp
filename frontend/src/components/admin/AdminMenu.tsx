import { useState, useRef, useEffect } from "react";

interface AdminProfile {
  name: string;
  email: string;
  picture?: string;
}

export function AdminMenu({
  profile,
  onViewTemplates,
  onLogout,
}: {
  profile: AdminProfile;
  onViewTemplates: () => void;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pr-3 pl-1 py-1 bg-white border border-gray-200 shadow-sm hover:border-purple-300 transition"
      >
        {profile.picture ? (
          <img src={profile.picture} alt="" className="w-7 h-7 rounded-full" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm text-gray-700">{profile.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Profile</p>
            <p className="font-medium text-slate-800">{profile.name}</p>
            <p className="text-sm text-gray-500 truncate">{profile.email}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              onViewTemplates();
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 transition"
          >
            My templates
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}