import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { sidebarMenus } from '@/app/data/types';
import { handleLogout } from '@/lib/supabase/actions';
interface SidebarProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

export default function Sidebar({ sidebarOpen, onMenuClick }: SidebarProps) {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<string[]>(() =>
    sidebarMenus
      .filter((section) =>
        section.items.some(
          (item) =>
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`))
        )
      )
      .map((section) => section.title)
  );

  function toggleSection(title: string) {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((section) => section !== title)
        : [...prev, title]
    );
  }

  return (
    <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {sidebarMenus.map((section) => {
            const hasSubmenu = section.items.length > 0;
            const isOpen = openSections.includes(section.title);

            return (
              <div className="sidebar-section" key={section.title}>
                {hasSubmenu ? (
                  <>
                    <button
                      type="button"
                      className="sidebar-section-toggle"
                      onClick={() => toggleSection(section.title)}
                      aria-expanded={isOpen}
                    >
                      <span className="sidebar-section-title w-full flex flex-row justify-between">
                        {section.title}
                        {/*  <ChevronDown
                          size={16}
                          className={`justify-end sidebar-chevron ${isOpen ? 'rotated' : ''}`}
                        /> */}
                      </span>
                    </button>

                    <div
                      className={`sidebar-submenu ${
                        isOpen ? 'submenu-open' : ''
                      }`}
                      aria-hidden={!isOpen}
                    >
                      <div className="px-5">
                        {section.items.map((item) => {
                          const Icon = item.icon;

                          return (
                            <div key={item.label}>
                              {item.label === 'Logout' ? (
                                <Link
                                  href="#"
                                  className={`sidebar-link ${
                                    pathname === item.href ? 'active' : ''
                                  }`}
                                  onClick={handleLogout}
                                >
                                  <Icon size={20} />
                                  <span>{item.label}</span>
                                </Link>
                              ) : (
                                <Link
                                  href={item.href}
                                  className={`sidebar-link ${
                                    pathname === item.href ? 'active' : ''
                                  }`}
                                  onClick={onMenuClick}
                                >
                                  <Icon size={20} />
                                  <span>{item.label}</span>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="sidebar-section-title">{section.title}</span>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
