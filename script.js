document.addEventListener("DOMContentLoaded", function () {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3
      .select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    ).then(function (data) {
      const dataset = data;
  
      const xScale = d3
        .scaleTime()
        .domain([
          d3.min(dataset, (d) => new Date(d.Year - 1, 0, 1)),
          d3.max(dataset, (d) => new Date(d.Year + 1, 0, 1)),
        ])
        .range([0, width]);
  
      const yScale = d3
        .scaleTime()
        .domain([
          d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
          d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
        ])
        .range([height, 0]);
  
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
  
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
      svg.append("g").attr("id", "y-axis").call(yAxis);
  
      svg
        .selectAll("dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", (d) => new Date(d.Year, 0, 1))
        .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
        .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
        .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
        .attr("r", 5)
        .on("mouseover", function (d) {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0.9;
          tooltip.style.left = xScale(new Date(d.Year, 0, 1)) + 10 + "px";
          tooltip.style.top = yScale(new Date(d.Seconds * 1000)) - 40 + "px";
          tooltip.setAttribute("data-year", d.Year);
          tooltip.innerHTML =
            d.Name +
            ": " +
            d.Nationality +
            "<br>Year: " +
            d.Year +
            "<br>Time: " +
            d.Time;
        })
        .on("mouseout", function () {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0;
        });
  
      const legend = d3.select("#legend");
      legend
        .append("div")
        .html("<div class='legend-dot'></div> Cyclists")
        .attr("class", "legend");
  
      const legendDot = d3.select(".legend-dot");
      legendDot
        .append("div")
        .html("<div class='dot'></div> Doping allegations")
        .attr("class", "legend");
    });
  });  