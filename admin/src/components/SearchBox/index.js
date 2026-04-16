import { IoSearch } from "react-icons/io5";
import { useState, useEffect, useContext } from "react";
import { SearchContext } from "../../context/SearchContext";

const SearchBox = () => {
  const { setSearchQuery } = useContext(SearchContext);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(query);
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="searchBox position-relative d-flex align-items-center">
      <IoSearch className="me-2" />

      <input
        type="text"
        placeholder="Search anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control"
      />
    </div>
  );
};

export default SearchBox;