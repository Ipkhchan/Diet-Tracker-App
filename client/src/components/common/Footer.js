import React from 'react'

const Footer = (props) => {
  return (
    <div className="px-2 px-sm-5 mt-4" style={{"fontSize": "10px"}}>
      <div className= "border border-secondary"/>
      <div className= "my-2">
        Powered by {" "}
        <a href="https://www.nutritionix.com/" title="nutritionix">Nutritionix</a>
      </div>
      <div className= "my-2">
          Icons made by {" "}
          <a href="https://www.flaticon.com/authors/smashicons" title="Apple">Apple</a> {" "}
          from {" "}
          <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> {" "}
          is licensed by {" "}
          <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
      </div>
    </div>
  )
}

export default Footer
