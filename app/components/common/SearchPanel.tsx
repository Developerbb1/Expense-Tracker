'use client';

import styles from '@/styles/AllTransactions.styles';
import { Search, X } from 'lucide-react';

type SearchPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchPanel({
  search,
  onSearchChange,
  placeholder = 'Search...',
}: SearchPanelProps) {
  return (
    <div className={styles.searchWrapper}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.searchInput}
      />

      {search && (
        <button
          type="button"
          className="clear-search"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
