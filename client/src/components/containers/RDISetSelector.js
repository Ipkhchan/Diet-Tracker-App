import React, {Component} from 'react';

class RDISetSelector extends Component {

  render() {
    const metrics = this.props.metrics;
    console.log("RDISetSelector metrics", metrics);

    return (
      <div>
        {(Object.keys(metrics).length)
          ?<div>
            <p>Currently Using RDI Set for {metrics.sex}s aged {metrics.age_min} to {metrics.age_max}.</p>
            <p>Source: {metrics.source}</p>
            <button>Change RDI Set</button>
           </div>
          :<form className= "userRDIForm" onSubmit={this.props.getRDISet}>
             <p>Enter your gender and age below:</p>
             <p>Gender :</p>
             <input type="radio" id="male" name="gender" value="male"/>
             <label htmlFor="male">male</label>
             <input type="radio" id="female" name="gender" value="female"/>
             <label htmlFor="female">female</label>
             <label htmlFor= "age">age</label>
             <input type="number" name="age" id="age"/>
             <input type="submit" value="enter"/>
           </form>
        }
      </div>
    )
  }
}

export default RDISetSelector
