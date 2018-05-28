import React, {Component} from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {alert: {success: false, message: ''}}
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = $('.loginForm').serializeArray();
    $.ajax({
      url: '/admin/login',
      method:'POST',
      processData: 'false',
      data: formData
    }).then((res) => {
      console.log(res);
      if(res.success) {
        localStorage.setItem('token', res.token);
        this.props.dispatch({type: 'TOGGLE'});
      }
      this.setState({alert: {"success": res.success, "message": res.message}})
    });
  }

  render() {
    const alert = this.state.alert;


    return(
      <div>
        {(alert.message.length)
          ? <p className={`alert ${(alert.success) ? "alert-success" : "alert-danger"}`}>{alert.message}</p>
          : null
        }
        {(alert.success == false)
          ?<form className="loginForm my-3 mx-3">
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
          : null
        }
      </div>
    )
  }
}

export default connect()(LoginPage)
