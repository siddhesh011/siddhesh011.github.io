
const arc = d3
    .arc()
    .outerRadius(Math.min(config.dimensions.pie_height, config.dimensions.pie_width)/2)
    .innerRadius(0);


const pie = d3
    .pie()
    .value((d) => d[1].length)
    .sort(null);


function gender_pie_chart(deaths_age_sex) {
    utility_shapes.removeSvgGroup("#pie-gender svg");

    const context_data = d3.group(deaths_age_sex, (d) => +d.gender);

    const pie_chartSvg = d3
        .select("#pie-gender")
        .append("svg")
        .attr("width", config.dimensions.pie_width)
        .attr("height", config.dimensions.pie_height);

    const gendergroup_container = pie_chartSvg
        .append("g")
        .attr("class", "arcs")
        .attr("transform", `translate(${config.dimensions.pie_width / 2}, ${config.dimensions.pie_height / 2})`);

    gendergroup_container
        .selectAll(".arc")
        .data(pie(context_data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("class", "gender-arc")
        .attr("fill", (d) =>
            d.data[0] === 0
                ? utility_shapes.mapLegendColorScale("Male")
                : utility_shapes.mapLegendColorScale("Female")
        )
        .on("mouseover", (event, on_event_data) => {
            const on_hover = on_event_data.data[0];
            d3.selectAll(".death-circle")
                .attr("opacity", (d) => (on_hover === +d.gender ? 1 : 0));

            d3.selectAll(".gender-arc")
                .attr("opacity", (d) => +d.data[0] === on_hover ? 1 : 0.3);

            utility_shapes.tooltip.show({
                content: `Sex: ${on_hover === 0 ? "Male" : "Female"}
                <br/>
                Deaths: ${on_event_data.data[1].length}`,
                x: event.pageX - 10,
                y: event.pageY - 15,
                duration: 200
            });
        })
        .on("mousemove", function (event, on_event_data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 10,
                y: event.pageY - 15
            });
        })
        .on("mouseout", (event, on_event_data) => {
            utility_shapes.tooltip.hide(500);

            d3.selectAll(".death-circle")
                .attr("opacity", 1);

            d3.selectAll(".gender-arc")
                .attr("opacity", 1);
        });

    gendergroup_container
        .selectAll(".arc-text")
        .data(pie(context_data))
        .enter()
        .append("text")
        .attr("class", "arc-text")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => (+d.data[0] === 0 ? "Male" : "Female"));

    gendergroup_container
        .selectAll(".arc-percentage")
        .data(pie(context_data))
        .enter()
        .append("text")
        .attr("class", "arc-percentage")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => ((d.data[1].length / deaths_age_sex.length) * 100).toFixed(1) + '%')

}


//test....


function functionpiechart(deaths_age_sex) {
   

    
    const pieChartcolour = (label) => {
        return d3.scaleOrdinal()
            .domain(["0-10", "11-21", "21-40", "41-60", "61-80", "80+"])
            .range(d3.schemeTableau10)(label);
    }
     utility_shapes.removeSvgGroup("#age-pie svg");
    const context_data = d3.sort(d3.group(deaths_age_sex, (d) => +d.age), (d) => d[0]);


// const bar_chart_svg = d3
//   .select("#age-pie")
//   .append("svg")
//   .attr("width", config.dimensions.pie_width)
//   .attr("height", config.dimensions.pie_height);

// const age_container = barChartSvg
//   .append("g")
//   .classed("arcs", true)
//   .attr("transform", `translate(${config.dimensions.pie_width / 2}, ${config.dimensions.pie_height / 2})`);





      const bar_chart_svg = d3
        .select("#age-pie")
        .append("svg")
        .attr("width", config.dimensions.pie_width)
        .attr("height", config.dimensions.pie_height);
  
    const age_container = bar_chart_svg
        .append("g")
        .attr("class", "arcs")
        .attr("transform", `translate(${config.dimensions.pie_width / 2}, ${config.dimensions.pie_height / 2})`);

     

    age_container
        .selectAll(".arc")
        .data(pie(context_data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("class", "age-arc")
        //function call to fill colors . . . . . 
        .attr("fill", (d) => pieChartcolour(ages(d.data[0])))
        .on("mouseover", (event, on_event_data) => {
            const on_hover = on_event_data.data[0];

            d3.selectAll(".death-circle")
                .attr("opacity", (d) => on_hover === +d.age ? 1 : 0);

            d3.selectAll(".age-arc")
                .attr("opacity", (d) => +d.data[0] === on_hover ? 1 : 0.3);

            utility_shapes.tooltip.show({
                content: `Age Group: ${ages(+on_hover)}
                <br/>
                Deaths: ${on_event_data.data[1].length}`,
                x: event.pageX - 10,
                y: event.pageY - 15,
                duration: 200
            });
        })
        .on("mousemove", function (event, on_event_data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 10,
                y: event.pageY - 15
            });
        })
        .on("mouseout", (event, on_event_data) => {
            utility_shapes.tooltip.hide(500);

            d3.selectAll(".death-circle")
                .attr("opacity", 1);

            d3.selectAll(".age-arc")
                .attr("opacity", 1);
        });



    age_container
        .selectAll(".arc-percentage")
        .data(pie(context_data))
        .enter()
        .append("text")
        .attr("class", "arc-percentage")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] + 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => ((d.data[1].length / deaths_age_sex.length) * 100).toFixed(1) + '%')

        age_container
        .selectAll(".arc-text")
        .data(pie(context_data))
        .enter()
        .append("text")
        .attr("class", "arc-text")
        .attr("transform", (d) => `translate(${arc.centroid(d)[0]}, ${arc.centroid(d)[1] - 10})`)
        .attr("alignment-baseline", "middle")
        .text((d) => `${ages(+d.data[0])}`);

}

const ages = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4, 5])
    .range(["0-10", "11-21", "21-40", "41-60", "61-80", "80+"]);

data.loadData(street_map_draw);
