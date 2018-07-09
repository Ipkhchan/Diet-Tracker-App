import React from 'react';

const MetricsFooter = (props) => {
  const headers = props.headers;
  const metrics = props.metrics;

  return (
    <tfoot>
      <tr>
        <td>RDI</td>
          {headers.map((header) =>
            (header !== "name")
            ? <td key={header+"-rdi"}>{metrics[header] || ""}</td>
            : null
          )}
      </tr>
    </tfoot>
  )
}


export default MetricsFooter
