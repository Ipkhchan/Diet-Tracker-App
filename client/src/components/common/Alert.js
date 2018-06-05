import React from 'react'

const AlertStyle = {
  "position": "fixed",
  "top": "90%",
  "left": "50%",
  "transform": "translate(-50%, -50%)",
  "z-index": "10",
}

const Alert = (props) => {
  return (
    <div className="d-flex justify-content-between alert alert-primary"
         style={AlertStyle}>
      <p className= "mr-3 vcenter">{props.alertMessage}</p>
      <button className= "btn btn-sm btn-outline-dark vcenter"
              onClick= {props.handleAlertMessage}>X</button>
    </div>
  )
}

export default Alert
