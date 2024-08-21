import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const SalaryChart = ({ basic, da, gross_salary, ta }) => {
  const [series, setSeries] = useState([0, 0, 0, 0]);
  const labels = ["Basic", "DA", "TA", "Gross Salary"];

  const [options, setOptions] = useState({
    chart: {
      width: "100%", // Set width to 100% for responsiveness
      height: 400,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      formatter: function (val, opts) {
        return (
          labels[opts.seriesIndex] +
          " - " +
          opts.w.globals.series[opts.seriesIndex]
        );
      },
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          return labels[opts.seriesIndex] + " : " + val;
        },
      },
      fixed: {
        enabled: true,
        position: "topRight",
      },
    },
    title: {
      text: "Salary",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%", // Ensure it adjusts for smaller screens
            height: 300, // Smaller height for smaller screens
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  useEffect(() => {
    // Update the series state when props change
    setSeries([basic, da, ta, gross_salary]);
  }, [basic, da, gross_salary, ta]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          width={380}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default SalaryChart;
