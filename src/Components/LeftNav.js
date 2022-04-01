import React, { useState } from "react";
import "./LeftNav.css";
function LeftNav() {
  const [startDate, setstartDate] = useState(Date());
  const [endDate, setEndDate] = useState("End");
  return (
    <div className="MainBox">
      <div className="box">
        <div className="heading1">ATT</div>
        <div className="buttonx">Network Meta Data</div>
        <div>
          <table style={{ width: "150px" }}>
            <tr>
              <th>5g</th>
              <td>cell IDs</td>
              <td>900</td>
            </tr>
            <tr>
              <th>5g</th>
              <td>Band 2500</td>
              <td>300</td>
            </tr>
            <tr>
              <th>5g</th>
              <td>Band 3100</td>
              <td>250</td>
            </tr>
          </table>
        </div>
      </div>
      <hr />
      <div className="box">
        <div className="heading2">DL Throughput</div>
        <div className="heading3">Number of Good poor and bad</div>
        <div>
          <table style={{ width: "150px" }}>
            <tr>
              <th>
                <div className="button1">Good</div>
              </th>
              <td>90/160</td>
            </tr>
            <tr>
              <th>
                <div className="button2">Poor</div>
              </th>
              <td>37/160</td>
            </tr>
            <tr>
              <th>
                <div className="button3">Bad</div>
              </th>
              <td>25/160</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="box">
        <div className="heading2">Comparison</div>
        <div className="heading3">track hex during the period</div>
        <div className="date1">
          <input
            type="month"
            id="start"
            name="start"
            placeholder="asd"
            value={startDate}
            className="input1"
            onChange={(e) => setstartDate(e.target.value)}
          />
        </div>
        <div className="date2">
          <input
            type="month"
            id="start"
            name="start"
            value={endDate}
            className="input2"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default LeftNav;
