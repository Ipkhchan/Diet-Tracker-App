import React, { Component } from 'react';
import $ from 'jquery';

class AdminFoodDataPage extends Component {
  constructor(props) {
    super(props);
    this.handleRead = this.handleRead.bind(this);
  }

  handleRead(e) {
    e.preventDefault();
    const file = document.querySelector("#input").files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
      let results = JSON.parse(reader.result);
      let partialResults = results.slice(0,10);
      console.log("hello", results.length);
      console.log(partialResults);
      console.log(partialResults[0].carbohydrate);

      // let partialResults= reader.result.slice(0,10);
      // console.log(partialResults);
      for (let i = 0; i < results.length -10; i+=10) {
        $.ajax({
          url: 'http://localhost:5000/admin/foodData',
          method:'POST',
          dataType:'JSON',
          processData: 'false',
          data: {data: results.slice(i, i+10)}
        }).then(function(res) {
          console.log(res);
        });
      };
    };
    reader.readAsText(file);


  }

  render() {
    return (
      <form>
        <input type="file" id="input"></input>
        <button onClick={this.handleRead}>Submit</button>
      </form>
    )
  }
}

export default AdminFoodDataPage
