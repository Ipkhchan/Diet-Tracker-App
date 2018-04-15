import React from 'react';

const DeficiencyList = (props) => {
  const deficiencyList = props.deficiencyList;
  return (
    <div>
      {Object.keys(deficiencyList).map(deficiency =>
        <div key={deficiency} className="flex">
          <p className= "block">{"You may be deficient in " + deficiency}</p>
          <div className="flex">
            <div>
              <p>{"your diet amount: " + Math.round(deficiencyList[deficiency].dietAmount*10)/10}</p>
              <p>{"the RDI is: " + Math.round(deficiencyList[deficiency].rdi*10)/10}</p>
            </div>
            <button className= {deficiency} onClick={props.handleNutritiousFoodSearch}>+</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeficiencyList
