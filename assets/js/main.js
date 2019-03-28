queue ()
  .defer(d3.json, "data/Data.json")
  .await(methods);

function methods(error, data) {

    // Create a new key / value in the data called "decade"
  
    data.forEach(function(x) {
      let decadeA = Math.floor(x.year/10)*10;
      var decade = decadeA//.toString() + "'s"
      x.decade = decade;
    })
    
    // floor deaths by 100 so total deaths = Total Deaths ('000)
    data.forEach(function(x) {
        x.total_deaths = Math.floor(x.total_deaths / 1000)
    })
    
    
    // Create a line graph showing number of total_deaths of each decade
    var ndx = crossfilter(data);
        var decade_dim = ndx.dimension(dc.pluck('decade'));
        var total_deaths_per_decade = decade_dim.group().reduceSum(dc.pluck('total_deaths'));
        
        var minDecade = decade_dim.bottom(1)[0].decade;
        var maxDecade = decade_dim.top(1)[0].decade;
        
        var total_deaths_dim = ndx.dimension(dc.pluck('total_deaths'));
        var minTotalDeaths = total_deaths_dim.bottom(1)[0].total_deaths;
        var maxTotalDeaths = total_deaths_dim.top(1)[0].total_deaths;
        
        var myScale = d3.scale.linear()
          .domain([minDecade, maxDecade])
          .range([0, 1000])
        // console.log(decade_dim)
        // console.log(minDecade)
        // console.log(maxDecade)
        // console.log(myScale(2010))
        
        var chart = dc.lineChart("#dashboard")
            .width(1000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(decade_dim)
            .group(total_deaths_per_decade)
            .transitionDuration(500)
            .x(myScale)
            .xAxisLabel("Decade")
            .yAxis().ticks(4);
            
            
            
        // # 2 # LINE GRAPH # 2 #
        
        // Margin
        var margin = {top: 30, right: 20, bottom: 30, left: 50};
        
        // Height & Width
        var width = 1000 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;
        
        // X & Y Scale
        var x = d3.scale.linear()
            .range([0, width])
            .domain([minDecade, maxDecade]);
            
        var y = d3.scale.linear()
            .range([height, 0])
            .domain([minTotalDeaths, maxTotalDeaths]);
        
        // X & Y Axis
        var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);
        
        var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(4);
        
        // Color Scheme 
        var color = d3.scale.category10(); // http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
        color.domain(d3.keys(data[0]).filter(function(key) {
          return key == "total_deaths";
        }));
        var totalDeaths = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {
                decade: d.decade,
                total_deaths: +d.total_deaths
              };
            })
          };
        });
        
        // Values plotted on graph (WHY VERTICAL??) 
        var valueline = d3.svg.line()
            .x(d => x(d.occurence))
        //  .x(data.forEach(function(v) {
        //           console.log(v.year)
        //           return v.year
        //       }))
            .y(d => y(d.total_deaths))
        //   .y(data.forEach(function(v) {
        //           console.log(v.total_deaths)
        //           return v.total_deaths
        //       }))
          console.log(data[0].year)
          
        // Create SVG in #main
        var svg = d3.select("#main")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // Total Deaths Legend 
        var legend = svg.selectAll('g')
          .data(totalDeaths)
          .enter()
          .append('g')
          .attr('class', 'legend');
          
        // Blue Square next to Legend
        legend.append('rect')
          .attr('x', width - 100)
          .attr('y', function(d, i) {
            return i * 20;
          })
          .attr('width', 10)
          .attr('height', 10)
          .attr('border-radius', 5)
          .style('fill', function(d) {
            return color(d.name);
          });
          
        // Legend Text
        legend.append('text')
          .attr('x', width - 88)
          .attr('y', function(d, i) {
            return (i * 20) + 9;
          })
          .text(function(d) {
            return d.name.toString().replace("_", " ");
          });
          
        //  svg.append("g")
        //   .attr("class", "x axis")
        //   .attr("transform", "translate(0," + height + ")")
        //   .call(xAxis);
    
        // Y Axis Label
        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Total Deaths ('000)");
        
        // Hover-Effect Line 
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);
            
        var mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");
    
        mouseG.append("path") 
          .attr("class", "mouse-line")
          .style("stroke", "grey")
          .style("stroke-width", "1px")
          .style("opacity", "1");
          
        var lines = document.getElementsByClassName('line');
        
        // Hover-effect Circle
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
          .data(totalDeaths)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");
    
        mousePerLine.append("circle")
          .attr("r", 7)
          .style("stroke", function(d) {
            return color(d.name);
          })
          .style("fill", function(d) {
            return color(d.name);
          })
          .style("stroke-width", "1px")
          .style("opacity", "0");
    
        mousePerLine.append("text")
          .attr("transform", "translate(10,0)");
          
        // Create a RECT to catch mouse movements on the canvas
    
        mouseG.append('svg:rect')
          .attr('width', width) 
          .attr('height', height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('mouseout', function() { 
            d3.select(".mouse-line")
              .style("opacity", "0.5");
            d3.selectAll(".mouse-per-line circle")
              .style("opacity", "0.5");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "0.5");
        })
        .on('mouseover', function() { 
            d3.select(".mouse-line")
              .style("opacity", "1");
            d3.selectAll(".mouse-per-line circle")
              .style("opacity", "1");
            d3.selectAll(".mouse-per-line text")
              .style("opacity", "1");
        })
          .on('mousemove', function() { // mouse moving over canvas
            var mouse = d3.mouse(this);
            d3.select(".mouse-line")
              .attr("d", function() {
                var d = "M" + mouse[0] + "," + height;
                d += " " + mouse[0] + "," + 0;
                return d;
              });
        
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            // console.log(width/mouse[0])
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;
        
            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
        });
          

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
    
        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        dc.renderAll();
}


        
