import React, { Component } from 'react';
import dietTracker from '../../api'

//TODO: implement NLP capabilities (ex. 1 slice of bacon)
class SearchBar extends Component {
  constructor(props) {
    super(props);
    // this.handleSearch = this.handleSearch.bind(this);
    // this.state = {searchResults: (dietTracker.searchResults)}
  }

  // handleSearch(e) {
  //   console.log(e.target);
  //   this.props.handleSearch(e);
  // }

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
