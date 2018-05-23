import React, { Component } from 'react';

//TODO: implement NLP capabilities (ex. 1 slice of bacon)
class SearchBar extends Component {
  render() {
      return (
        <form className="form-inline my-2"
              onSubmit= {(e) => {
                e.preventDefault();
                this.props.handleSearch();
              }}>
          <input placeholder="Search Food Item" className="form-control search"/>
          <input type="submit" value="Search" className="btn-sm btn-outline-success mx-2"/>
        </form>
      )

  };
}

export default SearchBar
