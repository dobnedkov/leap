import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  autoFocus = false,
  placeholder = "Search tabs…",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="search-bar">
      <Search className="search-icon" size={14} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        spellCheck={false}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
