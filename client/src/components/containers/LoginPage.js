import React, {Component} from 'react';
import $ from 'jquery';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {messages: {}}
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = $('.loginForm').serializeArray();
    $.ajax({
      url: 'http://localhost:5000/admin/login',
      method:'POST',
      processData: 'false',
      data: formData
    }).then((res) => {
      console.log(res);
      if(res.success) {
        localStorage.setItem('token', res.token);
        this.setState({messages: res.message})
        // window.location.assign("http://localhost:3000/")
      } else {
        this.setState({messages: res.message})
      }
    });
  }

  render() {
    const messages = this.state.messages

    return(
      <div>
        {(Object.keys(messages).length)
          ? <p>{messages}</p>
          : null
        }
        <form className="loginForm flex-column">
          <div>
            <label>Username: </label>
            <input type="text" name="username"></input>
          </div>
          <div>
            <label>Password: </label>
            <input type="text" name="password"></input>
          </div>
          <input type="submit" value="submit" onClick={this.handleSubmit}/>
        </form>
      </div>
    )
  }
}

export default LoginPage
