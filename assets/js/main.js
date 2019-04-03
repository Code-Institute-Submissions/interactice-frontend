// https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
// year, iso, country_name, disaster_type, occurrence, total_deaths, 
// injured, affected, homeless, total_affected, total_damage


queue ()
  .defer(d3.json, "data/data.json")
  .await(methods);

function methods(error, data) {
  var ndx = crossfilter(data);
    
  // Create a new key / value in the data called "decade"
  data.forEach(function(x) {
    let decadeA = Math.floor(x.year/10)*10;
    var decade = decadeA//.toString() + "'s"
    x.decade = decade;
  });
  
  // floor deaths by 100 so total deaths = Total Deaths ('000)
  data.forEach(function(x) {
      x.total_deaths = Math.floor(x.total_deaths / 1000)
  });
  
  
  //Graphs 
  showDeathsPerDecade(ndx);
  showDisastersPerDecade(ndx);

  
  dc.renderAll();
}
    // Create a line graph showing number of total_deaths of each decade
    
    function showDeathsPerDecade(ndx) {
      var decade_dim = ndx.dimension(dc.pluck('decade'));
      var total_deaths_per_decade = decade_dim.group().reduceSum(dc.pluck('total_deaths'));
  
      var minDecade = decade_dim.bottom(1)[0].decade;
      var maxDecade = decade_dim.top(1)[0].decade;
      
      var total_deaths_dim = ndx.dimension(dc.pluck('total_deaths'));
      var minTotalDeaths = total_deaths_dim.bottom(1)[0].total_deaths;
      var maxTotalDeaths = total_deaths_dim.top(1)[0].total_deaths;
      
      var myScale = d3.scale.linear()
          .domain([minDecade, maxDecade])
          .range([0, 100])

      
      var chart = dc.lineChart("#dashboard")
      
      chart
          .width(600)
          .height(400)
          .brushOn(false)
          .margins({top: 10, right: 50, bottom: 30, left: 50})
          .dimension(decade_dim)
          .group(total_deaths_per_decade)
          .transitionDuration(500)
          .x(myScale)
          .xAxisLabel("Decade")
          .yAxisLabel("Total Deaths")
          .title(function(d) { return  `${d.value} Total Deaths in ${d.key}` })
          .yAxis().ticks(4)
          
      }
    function showDisastersPerDecade(ndx){
      
    // Pluck Data By Decade
    var decadeDim = ndx.dimension(dc.pluck("decade"));
    var yearDim = ndx.dimension(dc.pluck("year"));
    
    // Create Stacked Group For Each Disaster Type
    var DisasterTypeByFlood = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Flood") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByDrought = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Drought") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByEpidemic = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Epidemic") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByVolcanic = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Volcanic activity") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByStorm = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Storm") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByEarthquake = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Earthquake") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByMassMoveDry = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Mass movement (dry)") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByExtremeTemp = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Extreme temperature") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByWildfire = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Wildfire") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    var DisasterTypeByImpact = yearDim.group().reduceSum(function(d) {
      if (d.disaster_type === "Impact") {
        return +d.occurrence;
      } else {
        return 0;
      }
    });
    
    // Create Scale ( 1900 - 2010 )
    var minDecade = decadeDim.bottom(1)[0].decade;
    var maxDecade = decadeDim.top(1)[0].decade;
    
    var myScale = d3.scale.linear()
          .domain([minDecade, 2019]) // 2010 Decade was not showing if used "maxDecade"
          .range([0, 100])
    
    // Create  Stacked Chart Variable
    var stackedChart = dc.barChart("#main")
    
    // baseMixin
    // General Chart Options + marginMixin
    stackedChart
      .width(600)
      .height(400)
      .margins({top: 10, right: 50, bottom: 30, left: 50});

    // Data Options 
    stackedChart
      .dimension(decadeDim)
      .group(DisasterTypeByDrought, "Drought")
      .stack(DisasterTypeByEarthquake, "Earthquake")
      .stack(DisasterTypeByEpidemic, "Epidemic")
      .stack(DisasterTypeByFlood, "Flood")
      .stack(DisasterTypeByImpact, "Impact")
      .stack(DisasterTypeByStorm, "Storm")
      .stack(DisasterTypeByVolcanic, "Volcanic Activity")
      .stack(DisasterTypeByWildfire, "Wildfire");
      
    // colorMixin
    stackedChart
      .colors(d3.scale.category20b());
    
    // coordinateGridMixin
    stackedChart
      .brushOn(false)
      .elasticX(false)
      .x(myScale)
      .xAxisLabel("Year")
      .yAxisLabel("Occurrences")
      .legend(
        dc.legend()
          .x(65)
          .y(30)
          .itemHeight(15)
          .gap(5))
      .centerBar(true)
      .title(function(d) { return  `${d.value} ${this.layer}'s occurred in  ${d.key}` })
      .mouseZoomable(true)
      .renderHorizontalGridLines(true)
      .on('renderlet', function(chart) {
                  chart.selectAll('rect').on('click', function(d) {
                     console.log(d);
                  });
               });
    }
  
    
    
    // Dead Graphs 
    // function showDeathsPerDecadeX (ndx) {
    //     var decade_dim = ndx.dimension(dc.pluck('decade'));
    //     var total_deaths_per_decade = decade_dim.group().reduceSum(dc.pluck('total_deaths'));
        
    //     var minDecade = decade_dim.bottom(1)[0].decade;
    //     var maxDecade = decade_dim.top(1)[0].decade;
        
    //     var total_deaths_dim = ndx.dimension(dc.pluck('total_deaths'));
    //     var minTotalDeaths = total_deaths_dim.bottom(1)[0].total_deaths;
    //     var maxTotalDeaths = total_deaths_dim.top(1)[0].total_deaths;
        
    //     var myScale = d3.scale.linear()
    //         .domain([minDecade, maxDecade])
    //         .range([0, 100])
        
    //     // Margin
    //     var margin = {top: 30, right: 20, bottom: 30, left: 50};
        
    //     // Height & Width
    //     var width = 1000 - margin.left - margin.right;
    //     var height = 300 - margin.top - margin.bottom;
        
    //     // X & Y Scale
    //     var x = d3.scale.linear()
    //         .range([0, width])
    //         .domain([minDecade, maxDecade]);
            
    //     var y = d3.scale.linear()
    //         .range([height, 0])
    //         .domain([minTotalDeaths, maxTotalDeaths]);
        
    //     // X & Y Axis
    //     var xAxis = d3.svg.axis().scale(x)
    //     .orient("bottom").ticks(10);
        
    //     var yAxis = d3.svg.axis().scale(y)
    //     .orient("left").ticks(4);
        
    //     // Color Scheme 
    //     var color = d3.scale.category10(); // http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
    //     color.domain(d3.keys(ndx[0]).filter(function(key) {
    //       return key == "total_deaths";
    //     }));
    //     var totalDeaths = color.domain().map(function(name) {
    //       return {
    //         name: name,
    //         values: data.map(function(d) {
    //           return {
    //             decade: d.decade,
    //             total_deaths: +d.total_deaths
    //           };
    //         })
    //       };
    //     });
        
    //     // Values plotted on graph (WHY VERTICAL??) 
    //     var valueline = d3.svg.line()
    //     .x(function (x) {
    //           return x.decade;
    //         })
    //     //.x(d => x(d.decade))
    //     //  .x(data.forEach(function(v) {
    //     //           console.log(v.year)
    //     //           return v.year
    //     //       }))
    //       .y(function (x) {
    //         return x.total_deaths;
    //       })
    //     // .y(d => y(d.total_deaths))
    //     //   .y(data.forEach(function(v) {
    //     //           console.log(v.total_deaths)
    //     //           return v.total_deaths
    //     //       }))
      
          
    //     // Create SVG in #main
    //     var svg = d3.select("#main")
    //         .append("svg")
    //         .attr("width", width + margin.left + margin.right)
    //         .attr("height", height + margin.top + margin.bottom)
    //         .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    //     // Total Deaths Legend 
    //     var legend = svg.selectAll('g')
    //       .data(totalDeaths)
    //       .enter()
    //       .append('g')
    //       .attr('class', 'legend');
          
    //     // Blue Square next to Legend
    //     legend.append('rect')
    //       .attr('x', width - 100)
    //       .attr('y', function(d, i) {
    //         return i * 20;
    //       })
    //       .attr('width', 10)
    //       .attr('height', 10)
    //       .attr('border-radius', 5)
    //       .style('fill', function(d) {
    //         return color(d.name);
    //       });
          
    //     // Legend Text
    //     legend.append('text')
    //       .attr('x', width - 88)
    //       .attr('y', function(d, i) {
    //         return (i * 20) + 9;
    //       })
    //       .text(function(d) {
    //         return d.name.toString().replace("_", " ");
    //       });
          
    //     //  svg.append("g")
    //     //   .attr("class", "x axis")
    //     //   .attr("transform", "translate(0," + height + ")")
    //     //   .call(xAxis);
    
    //     // Y Axis Label
    //     svg.append("g")
    //       .attr("class", "y axis")
    //       .call(yAxis)
    //       .append("text")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", ".71em")
    //       .style("text-anchor", "end")
    //       .text("Total Deaths ('000)");
        
    //     // Hover-Effect Line 
    //     svg.append("path")
    //         .data([ndx])
    //         .attr("class", "line")
    //         .attr("d", valueline);
            
    //     var mouseG = svg.append("g")
    //         .attr("class", "mouse-over-effects");
    
    //     mouseG.append("path") 
    //       .attr("class", "mouse-line")
    //       .style("stroke", "grey")
    //       .style("stroke-width", "1px")
    //       .style("opacity", "1");
          
    //     var lines = document.getElementsByClassName('line');
        
    //     // Hover-effect Circle
    //     var mousePerLine = mouseG.selectAll('.mouse-per-line')
    //       .data(totalDeaths)
    //       .enter()
    //       .append("g")
    //       .attr("class", "mouse-per-line");
    
    //     mousePerLine.append("circle")
    //       .attr("r", 7)
    //       .style("stroke", function(d) {
    //         return color(d.name);
    //       })
    //       .style("fill", function(d) {
    //         return color(d.name);
    //       })
    //       .style("stroke-width", "1px")
    //       .style("opacity", "0");
    
    //     mousePerLine.append("text")
    //       .attr("transform", "translate(10,0)");
          
    //     // Create a RECT to catch mouse movements on the canvas
    
    //     mouseG.append('svg:rect')
    //       .attr('width', width) 
    //       .attr('height', height)
    //       .attr('fill', 'none')
    //       .attr('pointer-events', 'all')
    //       .on('mouseout', function() { 
    //         d3.select(".mouse-line")
    //           .style("opacity", "0.5");
    //         d3.selectAll(".mouse-per-line circle")
    //           .style("opacity", "0.5");
    //         d3.selectAll(".mouse-per-line text")
    //           .style("opacity", "0.5");
    //     })
    //     .on('mouseover', function() { 
    //         d3.select(".mouse-line")
    //           .style("opacity", "1");
    //         d3.selectAll(".mouse-per-line circle")
    //           .style("opacity", "1");
    //         d3.selectAll(".mouse-per-line text")
    //           .style("opacity", "1");
    //     })
    //       .on('mousemove', function() { // mouse moving over canvas
    //         var mouse = d3.mouse(this);
    //         d3.select(".mouse-line")
    //           .attr("d", function() {
    //             var d = "M" + mouse[0] + "," + height;
    //             d += " " + mouse[0] + "," + 0;
    //             return d;
    //           });
        
    //     d3.selectAll(".mouse-per-line")
    //       .attr("transform", function(d, i) {
    //         // console.log(width/mouse[0])
    //         var xDate = x.invert(mouse[0]),
    //             bisect = d3.bisector(function(d) { return d.date; }).right;
    //             idx = bisect(d.values, xDate);
            
    //         var beginning = 0,
    //             end = lines[i].getTotalLength(),
    //             target = null;
        
    //         while (true){
    //           target = Math.floor((beginning + end) / 2);
    //           pos = lines[i].getPointAtLength(target);
    //           if ((target === end || target === beginning) && pos.x !== mouse[0]) {
    //               break;
    //           }
    //           if (pos.x > mouse[0])      end = target;
    //           else if (pos.x < mouse[0]) beginning = target;
    //           else break; //position found
    //         }
            
    //         d3.select(this).select('text')
    //           .text(y.invert(pos.y).toFixed(2));
              
    //         return "translate(" + mouse[0] + "," + pos.y +")";
    //       });
    //     });
          

    //     // Add the X Axis
    //     svg.append("g")
    //         .attr("class", "x axis")
    //         .attr("transform", "translate(0," + height + ")")
    //         .call(xAxis);
    
    //     // Add the Y Axis
    //     svg.append("g")
    //         .attr("class", "y axis")
    //         .call(yAxis);
    // }
        

