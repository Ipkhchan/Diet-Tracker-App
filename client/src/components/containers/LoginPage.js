import React, {Component} from 'react';
import {connect} from 'react-redux';
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
        this.props.dispatch({type: 'TOGGLE'});
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
          ? <p className="alert alert-success">{messages}</p>
          : null
        }
        <form className="loginForm my-3 mx-3">
          <div className="form-group">
            <label>Username: </label>
            <input className="form-control" type="text" name="username"></input>
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input className="form-control" type="text" name="password"></input>
          </div>
          <input className="btn btn-primary float-right" type="submit" value="submit" onClick={this.handleSubmit}/>
        </form>
      </div>
    )
  }
}

export default connect()(LoginPage)
