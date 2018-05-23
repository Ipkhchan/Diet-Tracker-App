import React,{Component} from 'react';
import $ from 'jquery';

class AdminSignUpPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {errors: []}
  }

  handleSubmit(e) {
    console.log("here");
    e.preventDefault();
    const formData = $('.signupForm').serializeArray();
    console.log(formData);
    $.ajax({
      url: 'http://localhost:5000/admin/signup',
      method:'POST',
      dataType:'JSON',
      processData: 'false',
      data: formData
    }).then((res) => {
      if(res === "success") {
        window.location.assign("http://localhost:3000/admin/signupSuccess")
      } else {
        console.log(res);
        this.setState({errors: res})
      }
    });
  }


  render() {
    const inputs = [{type:"text", name:"firstName", label: "First Name"},
                    {type:"text", name:"lastName", label: "Last Name"},
                    {type:"text", name:"email", label: "Email"},
                    {type:"text", name:"username", label: "Username"},
                    {type:"text", name:"password", label: "Password"}];
    const errors = this.state.errors;

    return (
      <form className="signupForm" className="my-3 mx-3">
        <h4>Enter Your Information Below</h4>
        <div>
          {(errors.length)
            ? errors.map((error) =>
              <p key={error.param} className="alert alert-danger">{error.msg}</p>
              )
            : null
          }
        </div>
        {inputs.map((input) =>
          <div key={input.name} className="form-group">
            <label>{input.label}:</label>
            <input type={input.type} name={input.name} className="form-control"></input>
          </div>
        )}
        <p>Gender :</p>
        <div className="form-check form-check-inline">
          <input type="radio" id="male" name="sex" value="male" className="form-check-input"/>
          <label htmlFor="male" className="form-check-label">male</label>
        </div>
        <div className="form-check">
          <input type="radio" id="female" name="sex" value="female" className="form-check-input"/>
          <label htmlFor="female" className="form-check-label">female</label>
        </div>
        <div className="my-3">
          <label htmlFor= "age">Age:</label>
          <input type="number" name="age" id="age" className="form-control"/>
        </div>
        <input type="submit" value="submit" onClick={this.handleSubmit} className="btn btn-primary my-3 float-right"></input>
      </form>
    )
  }
}

// action="http://localhost:5000/admin/signup"

export default AdminSignUpPage
