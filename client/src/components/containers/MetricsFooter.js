import React, { Component } from 'react';

class MetricsFooter extends Component {
  render() {
    return (
      <tfoot>
        <tr>
          <td>RDI</td>
            {this.props.headers.map((header) =>
              (header !== "name")
              ? <td key={header+"-rdi"}>{this.props.metrics[header] || ""}</td>
              : null
            )}
        </tr>
      </tfoot>
    )
  }
}

export default MetricsFooter
