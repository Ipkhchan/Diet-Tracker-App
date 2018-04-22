import React from 'react';

//TODO: 2 footer elements created here. Opportunity to use Higher Order Component?
const NutritionTableTotals = (props) => {
  const headers = props.headers;
  const dietTotals = props.dietTotals;
  let footerData = {};

  //filter out the ones you actually want to display
  headers.forEach(header => {
    footerData[header] = dietTotals[header] || "";
  })
  footerData.name = "Total";

  return (
      <tr>
        {Object.keys(footerData).map((footer) =>
          <td key={footer + "-footer"}>
            {typeof footerData[footer].dietAmount == "number"
            ? Math.round(footerData[footer].dietAmount*10)/10
            : footerData[footer]}
          </td>
        )}
      </tr>
  )

};

export default NutritionTableTotals
