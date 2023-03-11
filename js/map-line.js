const zoomInCircle = (event, on_event_data) =>
    d3.selectAll(`.${on_event_data.replaceAll(' ', '-').toLowerCase()}-circle`)
        .attr('r', 10);

const zoomOutCircle = (event, on_event_data) =>
    d3.selectAll(`.${on_event_data.replaceAll(' ', '-').toLowerCase()}-circle`)
        .attr('r', 8);

const street_map_draw = (data_streets) => {
    let street_map_svg = d3
        .select("#map-streets")
        .append("svg")
        .attr("width", config.dimensions.map_width)
        .attr("height", config.dimensions.map_height + 30);

    let map_container = street_map_svg
        .append("g")
        .attr("class", "map-container")
        .attr("transform", "translate(0, 30)");

    data_streets.forEach((street) => {
        map_container
            .append("path")
            .attr("d", utility_shapes.line(street))
            .attr("stroke", "black")
            .attr("stroke-width", 3)
            .attr("fill", "none");
    });

    map_container
        .append("circle")
        .attr("class", "work-house-circle")
        .attr("cx", 3.5 * (config.dimensions.map_width / 7))
        .attr("cy", 2.3 * (config.dimensions.map_height / 7))
        .attr("r", 8)
        .attr("fill", (d) => utility_shapes.mapLegendColorScale("Work House"))
        .on("mouseover", function (event, on_event_data) {
            utility_shapes.tooltip.show({
                content: 'Work House',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            utility_shapes.tooltip.hide(500);
        });;

    map_container
        .append("circle")
        .attr("class", "brewery-circle")
        .attr("cx", 4.45 * (config.dimensions.map_width / 7))
        .attr("cy", 3.1 * (config.dimensions.map_height / 7))
        .attr("r", 8)
        .attr("fill", (d) => utility_shapes.mapLegendColorScale("Brewery"))
        .on("mouseover", function (event, on_event_data) {
            utility_shapes.tooltip.show({
                content: 'Brewery',
                x: event.pageX + 20,
                y: event.pageY - 10,
                duration: 200
            });
        })
        .on("mousemove", function (event, data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            utility_shapes.tooltip.hide(500);
        });

    const map_legend = street_map_svg
        .append("g")
        .attr("id", "map-legend-group")
        .attr("class", "map-legend")
        .attr("transform", "translate(10, 10)");

    map_legend
        .selectAll("circle")
        .data(config.map_label)
        .enter()
        .append("circle")
        .attr('class', 'legend-circle')
        .attr("cx", (d, i) => i * (config.dimensions.map_width / config.map_label.length))
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", (d) => utility_shapes.mapLegendColorScale(d))
        .on("mouseover", zoomInCircle)
        .on("mousemove", zoomInCircle)
        .on("mouseout", zoomOutCircle);

    map_legend
        .selectAll("text")
        .data(config.map_label)
        .enter()
        .append("text")
        .attr("x", (d, i) => 15 + i * (config.dimensions.map_width / config.map_label.length))
        .attr("y", 0)
        .attr("dy", "0.35em")
        .text((d) => d)
        .on("mouseover", zoomInCircle)
        .on("mousemove", zoomInCircle)
        .on("mouseout", zoomOutCircle);

    let streets = [
        { name: 'Broad Street', x: 3.8, y: 3.25, angle: -28 },
        { name: 'Oxford Street', x: 2.8, y: 1.15, angle: -12 },
        { name: 'Regent Street', x: 1.78, y: 3.8, angle: 62 },
        { name: 'Dean Street', x: 5.84, y: 2.5, angle: 67 },
        { name: 'Soho Square', x: 5.9, y: 1, angle: -5 },
        { name: 'Recents Quadrants', x: 3.8, y: 6.25, angle: 5 },
    ];

    map_legend
        .selectAll(".streets")
        .data(streets)
        .enter()
        .append("text")
        .attr('class', 'street')
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x * (config.dimensions.map_width / 7)}, ${d.y * (config.dimensions.map_height / 7)}) rotate(${d.angle})`)
        .text((d) => d.name);

    plotPumps(data.data_pumps);
}

const plotPumps = (data_pumps) => {
    utility_shapes.removeSvgGroup("#map-streets .map-container #pump-circle-group");

    map_container = d3.select("#map-streets")
        .select(".map-container")

    const pumps_group = map_container
        .append("g")
        .attr("id", "pump-circle-group")
        .selectAll(".pump-circle")
        .data(data_pumps);

    pumps_group
        .enter()
        .append("circle")
        .attr("class", "pump-circle")
        .attr("cx", (d) => utility_shapes.x(d.x))
        .attr("cy", (d) => utility_shapes.y(d.y))
        .attr("r", 6)
        .attr("fill", (d) => utility_shapes.mapLegendColorScale("Pump"));

    deaths_plot(data.deaths_age_sex, true);
}

const deaths_plot = (deathsData, relinechart) => {
    utility_shapes.removeSvgGroup("#map-streets .map-container #death-circle-group");

    const deaths_group = d3
        .select("#map-streets")
        .select(".map-container")
        .append("g")
        .attr("id", "death-circle-group")
        .selectAll(".death-circle")
        .data(deathsData);

    deaths_group
        .enter()
        .append("circle")
        .attr("class", "death-circle")
        .attr("cx", (d) => utility_shapes.x(d.x))
        .attr("cy", (d) => utility_shapes.y(d.y))
        .attr("r", 4)
        .attr("fill", (d) =>
            +d.gender === 0
                ? utility_shapes.mapLegendColorScale("Male")
                : utility_shapes.mapLegendColorScale("Female")
        )
        .style("cursor", "pointer")
        .on("mouseover", function (event, on_event_data) {
            utility_shapes.tooltip.show({
                content: `Age: ${ages(on_event_data.age)}<br/>Sex: ${on_event_data.gender === "0" ? "Male" : "Female"}<br/>Death: ${on_event_data.date}`,
                x: event.pageX + 18,
                y: event.pageY - 10,
                duration: 190
            });
        })
        .on("mousemove", function (event, data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 10
            });
        })
        .on("mouseout", function (event) {
            utility_shapes.tooltip.hide(500);
        });

    if (relinechart) {
        Line_chart(data.data_death);
    }
}



// // zoom feature for map
// var zoom_feature = d3.zoom()
//   .scaleExtent([0.5, 4]) 
//   .on("zoom", function () {
   
//     d3.select("#street_map_svg").attr("transform", d3.event.transform_zoom);
//   });


// d3.select("#street_map_svg")
//   .call(zoom_feature)
//   .on("wheel.zoom", function () {
 
//     d3.event.preventDefault();

    
//     var scale = 1 + d3.event.deltaY * 0.01;


//     var transform_zoom = d3.select("#street_map_svg").attr("transform");
//     var x = d3.mouse(this)[0];
//     var y = d3.mouse(this)[1];
//     transform_zoom = "translate(" + x + "," + y + ")scale(" + scale + ")translate(" + (-x) + "," + (-y) + ")";
//     d3.select("#street_map_svg").attr("transform", transform_zoom);
//   });



let time_format = d3.timeFormat("%d-%b");
let dates_selected = [];

function Line_chart(death_days_a) {
    let data_set_death = [];

    let width = config.dimensions.line_width;
    let height = config.dimensions.line_height;
    let padding = 50;

    let line_chart_svg = d3
        .select("#timeline-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height + 25)
        .attr("viewBox", "0 0 " + width + " " + (height + 25));

    death_days_a.forEach(element => {
        data_set_death.push({
            date: new Date(element.date + '-' + config.year),
            value: element.deaths
        });
    });

    let minimum_date = d3.min(data_set_death, (d) => d.date);
    let maximum_date = d3.max(data_set_death, (d) => d.date);

    minimum_date.setDate(minimum_date.getDate());

    // function for x_Scale  . . . .  . .


    let x_Scale = d3.scaleTime()
        .domain([minimum_date, maximum_date])
        .range([padding, width - padding]);

    // function for y_Scale . . . . . .
    let y_Scale = d3.scaleLinear()
        .domain([0, (parseInt(d3.max(death_days_a, function (d) { return +d.deaths; }) / 20) + 1) * 20])
        .range([height - padding, padding]);

    // create x-axis . . . . .  .
    let xAxis = d3.axisBottom(x_Scale)
        .tickFormat(d3.timeFormat("%d %b"))
        
        .ticks(15);

    line_chart_svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.6em")
        .attr("dy", ".12em")
        .attr("transform", "rotate(-60)");

    //create y-axis . . . . .
    let yAxis = d3.axisLeft(y_Scale)
        .tickFormat((d) => d)
        .tickSize(5, 5, 0)
        .ticks(6);

    line_chart_svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ", 0)")
        .call(yAxis);

    

    // labels for y axis. . . . . . .  .
    line_chart_svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", 10)
        .attr("y", 100)
        .text("Number of Deaths")
        .attr("transform", "translate(-85, 125) rotate(-90)");

    let line = d3.line()
        .x((d) => x_Scale(d.date))
        .y((d) => y_Scale(d.value ?? 0));


    line_chart_svg.append("path")
        .attr("d", line(data_set_death))
        .attr('fill', 'none')
        .attr('stroke', 'black');

    // circles plotting ........
    line_chart_svg.selectAll("circle")
        .data(data_set_death)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("id", (d) => "__" + time_format(d.date))
        .attr("cx", (d) => x_Scale(d.date))
        .attr("cy", (d) => y_Scale(d.value))
        .attr("fill", "red")
        // .attr("fill", (d) => utility_shapes.mapLegendColorScale("deaths"))
        .attr("r", (d) => d.value == 0 ? 0 : 4)
        .on("mouseover", (event, on_event_data) => {
            d3.selectAll("#__" + time_format(on_event_data.date))
                .attr("r", 10);

            utility_shapes.tooltip.show({
                content: "<b>Date: </b>" + time_format(on_event_data.date) + "<br/>" + "<b>No of Deaths: </b>" + on_event_data.value,
                x: event.pageX + 20,
                y: event.pageY - 25,
                duration: 200
            });
        })
        .on("mousemove", function (event, on_event_data) {
            utility_shapes.tooltip.move({
                x: event.pageX + 20,
                y: event.pageY - 25
            });
        })
        .on("mouseout", (event, on_event_data) => {
            utility_shapes.tooltip.hide(500);

            d3.selectAll("#__" + time_format(on_event_data.date))
                .attr("r", 4);
        })
        .on("click", (event, on_event_data) => {
            const Id_lat = time_format(on_event_data.date);
            if (!dates_selected.includes(Id_lat)) {
                dates_selected.push(Id_lat);
            } else {
                dates_selected.splice(dates_selected.indexOf(Id_lat), 1);
            }

            // adjust opacity . . . . . . 
            d3.selectAll(".data-point").attr("opacity", 0.2);

            if (dates_selected && dates_selected.length > 0) {
                for (let ind in dates_selected) {
                    d3.select("#__" + dates_selected[ind]).attr("opacity", 1);
                }
            } else {
                d3.selectAll(".data-point").attr("opacity", 1);
            }

            let data_new = data.deaths_age_sex.filter((x) => dates_selected.includes(x.date));

            if (!data_new || data_new.length === 0) {
                data_new = data.deaths_age_sex
            }

            deaths_plot(data_new);
            gender_pie_chart(data_new);
            functionpiechart(data_new);
        });

    gender_pie_chart(data.deaths_age_sex);
    functionpiechart(data.deaths_age_sex)
}


