import React, {Component} from 'react'
import $ from 'jquery';

class AdminMetricsPage extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const formData = $('.rdiForm').serializeArray();
    const postData = {};
    formData.forEach(metric => {
      postData[metric.name] = metric.value;
    });

    $.ajax({
      url: '/admin/metrics',
      method:'POST',
      dataType:'text',
      processData: 'false',
      data: postData
    }).then(function(res) {
      alert(res);
    });
  }

  render() {
    return(
      <form className="rdiForm" onSubmit={this.handleSubmit}>
        {this.props.metrics.map((metric) =>
          <div key={metric}>
            <label htmlFor={metric}>{metric + ":"}</label>
            <input type="text" name={metric} id={metric}/>
          </div>
        )}
        <input type="submit" value="submit"/>
      </form>
    )
  }
};

export default AdminMetricsPage
