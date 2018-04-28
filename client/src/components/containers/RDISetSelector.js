import React, {Component} from 'react';
import $ from 'jquery';

class RDISetSelector extends Component {
  constructor(props) {
    super(props);
    // this.getRDISet = this.getRDISet.bind(this);
  }

  // getRDISet(e) {
  //   e.preventDefault();
  //   const [sex, age] = $('.userRDIForm').serializeArray();
  //   console.log(sex, age);
  //
  //   $.ajax({
  //     url: 'http://localhost:5000/admin/metrics/' + sex.value +'/' + age.value,
  //     method:'GET',
  //     dataType:'JSON'
  //   }).then(function(res) {
  //     console.log(res);
  //   });
  // }

  render() {
    return (
      <form className= "userRDIForm" onSubmit={this.props.getRDISet}>
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
    )
  }
}

export default RDISetSelector
