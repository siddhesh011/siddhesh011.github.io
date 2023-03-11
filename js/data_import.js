
var data = {
    data_death: [],
    data_pumps: [],
    data_streets: [],
    deaths_age_sex: [],
    Reduced_data_streets: [],

    loadData: async (callback) => {
        data.data_pumps = await d3.csv("data/pumps.csv");
        data.deaths_age_sex = await d3.csv("data/deaths_age_sex.csv");
        data.data_streets = await d3.json("data/streets.json");
        data.data_death = await d3.csv("data/deathdays.csv");

        if (data.data_streets && data.data_streets.length > 0) {
            data.Reduced_data_streets = data.data_streets.reduce((prev, curr) => prev.concat(curr), []);

            var index = 0;

            if (data.data_death && data.data_death.length > 0) {

                data.data_death.map((item) => {
                    var countOfDeaths = item.deaths;
                    while (countOfDeaths > 0 && index < data.deaths_age_sex.length) {
                        data.deaths_age_sex[index].date = time_format(new Date(item.date + '-' + config.year));
                        
                        countOfDeaths--;
                        index++;
                    }
                });

                callback(data.data_streets);
            }
        }
    }
};

//shape util
var config = {
    year: 1850,
    dimensions: {
        pie_height: 284,
        pie_width: 285,
        line_height: 285,
        line_width: 650,
        map_height: 524,
        map_width: 600,
        
    },
    map_label: ["Male", "Female", "Pump", "Brewery", "Work House"]
}

var utility_shapes = {
    mapLegendColorScale: (label) => {
        return d3.scaleOrdinal()
            .domain(config.map_label)
            // .range(d3.schemeSet3)(label);
             .range(d3.schemeTableau10)(label);
    },

    x: (x) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.Reduced_data_streets, (d) => d.x))
            .range([0, config.dimensions.map_width])(x);
    },

    y: (y) => {
        return d3.scaleLinear()
            .domain(d3.extent(data.Reduced_data_streets, (d) => d.y))
            .range([config.dimensions.map_height, 0])(y);
    },

    line: (lineData) => {
        return d3.line()
            .x((d) => utility_shapes.x(d.x))
            .y((d) => utility_shapes.y(d.y))(lineData);
    },

    removeSvgGroup: (selector) => {
        d3.select(selector).remove();
    },

    tooltip: {
        div: d3.select(".container")
            .append("div")
            .attr("class", "tooltip"),
        show: (config) => {
            utility_shapes.tooltip.div.html(config.content)
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
                .transition().duration(config.duration ?? 200).style("opacity", 1);
        },
        move: (config) => {
            utility_shapes.tooltip.div
                .style("left", `${config.x}px`)
                .style("top", `${config.y}px`)
        },
        hide: (duration) => {
            utility_shapes.tooltip.div.transition().duration(duration ?? 500).style("opacity", 0);
        }
    }
}
