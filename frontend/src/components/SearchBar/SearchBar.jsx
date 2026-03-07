import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  return (
    <input 
      type="text" 
      placeholder="Search movies..." 
      className="search-box"
      onChange={(e) => onSearch?.(e.target.value)}
    />
  );
};

export default SearchBar;
