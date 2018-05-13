import React from 'react'

const DietNamePopup = (props) => {
  return (
    <div className="centered-popup" style ={{background: "white"}}>
      <p>Enter a Name for your Diet: </p>
      <form onSubmit= {(e) => {
        e.preventDefault();
        props.submitDietName();
      }}>
        <input type="text" id="dietName"/>
        <input type="submit" value="Enter"/>
      </form>
    </div>
  )
}

export default DietNamePopup
