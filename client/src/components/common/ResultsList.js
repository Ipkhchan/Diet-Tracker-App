import React from 'react';

const ResultsList = (props) => {
  return (
    <ul className="list-group ">
      {props.searchResults.map((searchResult) =>
        <button key={searchResult}
                onClick={props.handleSelectItem}
                className= "list-group-item list-group-item-action">{searchResult}</button>
      )}
    </ul>
  )
};

export default ResultsList
