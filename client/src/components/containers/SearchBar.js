import React, { Component } from 'react';

//TODO: implement NLP capabilities (ex. 1 slice of bacon)
class SearchBar extends Component {
  render() {
      return (
        <form onSubmit= {(e) => {
          e.preventDefault();
          this.props.handleSearch();
        }}>
          <input placeholder="Search" className="search"/>
          <input type="submit" value="Search" className="searchIcon"/>
        </form>
      )

  };
}

export default SearchBar
