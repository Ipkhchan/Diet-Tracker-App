import React from 'react';

const ResultsList = (props) => {
  return (
    <ul>
      {props.searchResults.map((searchResult) =>
        <li key={searchResult} onClick={props.handleSelectItem}>{searchResult}</li>
      )}
    </ul>
  )
};

export default ResultsList
