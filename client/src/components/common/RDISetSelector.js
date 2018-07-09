import React from 'react';

const RDISetSelector = (props) => {
  const metrics = props.metrics;
  const showRDISetForm = props.showRDISetForm;
  const toggleShowRDISetForm = props.toggleShowRDISetForm
  const handleGetRDISet = props.handleGetRDISet;

  return (
    <div>
      {(Object.keys(metrics).length && !showRDISetForm)
        ?<div className= "card">
          <div className= "card-body">
            <p className= "card-text">Currently Using RDI Set for {metrics.sex}s aged {metrics.age_min} to {metrics.age_max}.</p>
            <p className= "card-text font-italic font-weight-light">Source: {metrics.source}</p>
            <button className="btn-sm btn-primary" onClick={toggleShowRDISetForm}>Change RDI Set</button>
          </div>
         </div>
        :<form className= "userRDIForm card" onSubmit={handleGetRDISet}>
           <div className= "card-body">
             <p className= "card-title font-weight-bold">Enter your gender and age below:</p>
             <div className= "row mx-0 my-2">
               <p className= "card-text col-6 col-sm-2 p-0 vcenter">Gender :</p>
               <div className = "col-6 px-0">
                 <div className="form-check form-check-inline">
                   <input className= "form-check-input" type="radio" id="male" name="gender" value="male"/>
                   <label className= "form-check-label" htmlFor="male">male</label>
                 </div>
                 <div className = "form-check form-check-inline">
                   <input className= "form-check-input" type="radio" id="female" name="gender" value="female"/>
                   <label className= "form-check-label" htmlFor="female">female</label>
                 </div>
               </div>
             </div>
             <div className="form-group row mx-0 my-2">
               <label className= "col-6 col-sm-2 p-0 vcenter" htmlFor= "age">Age :</label>
               <input className= "form-control col-2" type="number" name="age" id="age"/>
             </div>
             <input className= "my-3 btn btn-primary float-right" type="submit" value="enter"/>
            </div>
         </form>
      }
    </div>
  )
}

export default RDISetSelector
