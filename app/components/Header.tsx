import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import UserButton from '@/app/components/UserButton';
import LogoutButton from '@/app/components/LogoutButton';

interface HeaderProps {
  sidebarOpen?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ sidebarOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="  menu-button"
          onClick={onMenuClick}
          aria-label="Toggle Menu"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <div className="logo-div">
          <Link href="/" className="logo-link">
            <div className="logo-link">
              <Image
                src="/images/exp_trkr.png"
                alt="Logo"
                width={60}
                height={60}
              />
            </div>

            <h1>Expense Tracker</h1>
          </Link>
        </div>
      </div>

      <div className="header-right">
        <UserButton />
        <LogoutButton />
      </div>
    </header>
  );
}
