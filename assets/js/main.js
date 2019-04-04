



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
  
  // floor total_damage by 100 so total_damage = Total Damage ('000)
  data.forEach(function(x) {
      x.total_damage = Math.floor(x.total_damage / 1000)
  });
  
 // How many country_name in the data
 
// console.log(data[0].country_name)

// data.forEach(function(d) {
//   console.log(d.country_name);
// })

  // Jquery Functions
  jqueryFunctions(ndx, data);
  
  //Graphs 
  showDisastersPerDecade(ndx);
  showDeathsPerDecade(ndx);
  showTotalDamagePerCountry(ndx);
  show_discipline_selector(ndx);
  // showTotalAffectedByType(ndx);
  
  // Render Graphs
  dc.renderAll();
}

  // Create a Stacked Bar-Chart of Occurences of Natural Disasters by Year.
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
    var stackedChart = dc.barChart("#stackedchart")
    
    // baseMixin
    // General Chart Options + marginMixin
    stackedChart
      .width(600)
      .height(437)
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
    
  // Create a Line Graph of Total Deaths by Natural Disasters by Decade.
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

      
      var chart = dc.lineChart("#linegraph")
      
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
          .yAxisLabel("Total Deaths ('000)")
          .title(function(d) { return  `${d.value} Total Deaths in ${d.key}` })
          .yAxis().ticks(4)
          
      }
      
  // Create a Pie Chart that shows total_damage ($) per County.
  function showTotalDamagePerCountry(ndx) {
    
    // Pluck data by country_name
    var country_nameDim = ndx.dimension(dc.pluck("country_name"));
    var total_damageDim = country_nameDim.group().reduceSum(dc.pluck("total_damage"))
    
    var floo
    
    var pieChart = dc.pieChart("#piechart")
    
    pieChart
      .height(500)
      .radius(250)
      .transitionDuration(1500)
      .dimension(country_nameDim)
      .group(total_damageDim)
      .title(function(d) {
        return `Total Damage('000) in ${d.key}: ${d.value} USD`
      })
      .colors(d3.scale.category20b());
  
  }
  // Create a Scatter Plot Graph that shows the amount of total_affected
  // and color code [injured, affected, homeless].
  function show_discipline_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('disaster_type'));
    var group = dim.group();
    
    dc.selectMenu("#disciplineSelector")
        .dimension(dim)
        .group(group);
}

  function jqueryFunctions(ndx, data) {
    $(document).ready(function() {
      
      $("#close-btn").click(function(){
        $("#reset-btn").animate({opacity: "0"}, 250).css("display", "none");
        $("#disciplineSelector").animate({opacity: "0"}, 250).css("display", "none");
        $(".menu").animate({height: '50px'}, 500);
      }); 
      
    })
  }

