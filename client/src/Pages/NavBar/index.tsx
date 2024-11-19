import React from "react";

function SearchBar() {
    return (
    <form className="d-flex me-auto">
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Describe your pet"
          aria-label="Search"
        />
        <button className="btn btn-outline-primary" type="submit">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;