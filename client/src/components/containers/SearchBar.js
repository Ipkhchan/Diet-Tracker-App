import React, { Component } from 'react';

//TODO: implement NLP capabilities (ex. 1 slice of bacon)
class SearchBar extends Component {
  render() {
      return (
        <form className="my-2 form-inline"
              onSubmit= {(e) => {
                e.preventDefault();
                this.props.handleSearch();
              }}>
          <input placeholder="Search Food Item" className="form-control search mr-sm-2"/>
          <input type="submit" value="Search" className="btn-sm btn-outline-success mt-3"/>
        </form>
      )

  };
}

export default SearchBar
