import React from "react";

const Search = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  handleSort,
  searchPlaceholder = "Search...",
  sortOptions = [],
}) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log("Search input value:", value); // Debugging line to log input
    setSearchTerm(value); // Ensure the state is being updated correctly
  };

  return (
    <div className="controls-container">
      <div className="search-container">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="sort-controls">
        <span>Sort by: </span>
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSort(option.key)}
            className={`sort-button ${
              sortConfig.key === option.key ? "active" : ""
            }`}
          >
            {option.label}{" "}
            {sortConfig.key === option.key &&
              (sortConfig.direction === "ascending" ? "↑" : "↓")}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Search;
