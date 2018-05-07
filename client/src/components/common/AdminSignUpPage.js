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
                    {type:"text", name:"password", label: "Password"}]
    const errors = this.state.errors;

    return (
      <form className="signupForm">
        <h2>Enter Your Information Below</h2>
        <div>
          {(errors.length)
            ? errors.map((error) =>
              <p key={error.param}>{error.msg}</p>
              )
            : null
          }
        </div>
        {inputs.map((input) =>
          <div key={input.name} className="form-group">
            <label>{input.label}:</label>
            <input type={input.type} name={input.name}></input>
          </div>
        )}
        <input type="submit" value="submit" onClick={this.handleSubmit}></input>
      </form>
    )
  }
}

// action="http://localhost:5000/admin/signup"

export default AdminSignUpPage
