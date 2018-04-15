import React from 'react';

const RDISetSelector = () => {
  return (
    <form>
     <p>Enter your gender and age below:</p>
     <label htmlFor="sex">Gender :</label>
     <select id="sex">
      <option value="male">male</option>
      <option value="female">female</option>
     </select>
     <label htmlFor="age">Age :</label>
     <input type="number" name="age"/>
     <input type="submit" value="enter"/>
    </form>
  )
}

export default RDISetSelector
