import React, { Component } from 'react';
import $ from 'jquery';

class MetricsFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {metrics: {}};
  }

  componentDidMount() {
    $.ajax({
      url: 'http://localhost:5000/admin/metrics/',
      method:'GET',
      dataType:'JSON'
    }).then((res) => {
      this.setState({metrics: res});
    }).then(() => {
      let deficiencyTracker = [];
      const dietTotals = this.props.dietTotals;
      for (let dietTotal in dietTotals) {
        if (dietTotals[dietTotal] < this.state.metrics[dietTotal]) {
          deficiencyTracker.push(dietTotal);
        }
      };
    })
  }

  render() {
    return (
      <tfoot>
        <tr>
          <td>RDI</td>
            {this.props.headers.map((header) =>
              (header != "name")
              ? <td key={header+"-rdi"}>{this.state.metrics[header] || ""}</td>
              : null
            )}
        </tr>
      </tfoot>
    )
  }
}

export default MetricsFooter
