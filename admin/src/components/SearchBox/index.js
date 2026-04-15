import { IoSearch } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const SearchBox = ({ setSearchQuery }) => {

  const [query, setQuery] = useState("");

  // ✅ INSTANT SEARCH (LIVE)
  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(query);   // 🔥 THIS IS MAIN LINE
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="searchBox position-relative d-flex align-items-center">
      <IoSearch />

      <input
        type="text"
        placeholder="Search here...."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;