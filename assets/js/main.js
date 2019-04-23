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
    
    // Jquery Functions
    jqueryFunctions(ndx, data);
    
    //Graphs 
    showDisastersPerDecade(ndx);
    showDeathsPerDecade(ndx);
    showTotalDamagePerCountry(ndx);
    show_discipline_selector(ndx);
    show_country_selector(ndx);
    showTotalDamagePerCountryTop(ndx, data);
    // showTotalDamagePerCountryBottom(ndx, data);
    show_occurence_num(ndx);
    show_total_death_num(ndx);
    
    // Render Graphs
    dc.renderAll();
}

  // JQuery Functions
  function jqueryFunctions(ndx, data) {
    $(document).ready(function() {
      // $('#ModalCenter').modal('show');
      
      // Menu Functions
      $("#close-btn").click(function(){
        $("#reset-btn").animate({opacity: "0"}, 250).css("display", "none");
        $("#disciplineSelector").animate({opacity: "0"}, 250).css("display", "none");
        $("#countrySelector").animate({opacity: "0"}, 250).css("display", "none");
        $(".menu").animate({height: '41px'}, 500);
        $(".toggle-btn").addClass("row_one", 500);
        $("#close-btn").css("display", "none");
        $("#open-btn").css("display", "block");
      });  
      $("#open-btn").click(function(){
        $("#reset-btn").animate({opacity: "100"}, 250).css("display", "block");
        $("#disciplineSelector").animate({opacity: "100"}, 250).css("display", "block");
        $("#countrySelector").animate({opacity: "110"}, 250).css("display", "block");
        $(".menu").animate({height: '200px'}, 500);
        $(".toggle-btn").removeClass("row_one", 500);
        $("#close-btn").css("display", "block");
        $("#open-btn").css("display", "none");
      }); 
    })
  }

  // Create a Selector in the Menu to change graphs according to disaster_type.
  function show_discipline_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('disaster_type'));
    var group = dim.group();
    
    dc.selectMenu("#disciplineSelector")
      .dimension(dim)
      .group(group);
}

  // Create a Selector in the Menu to change graphs according to country_name.
  function show_country_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('country_name'));
    var group = dim.group();
    
    dc.selectMenu("#countrySelector")
        .dimension(dim)
        .group(group);
}

  // Show the Number of Occurrences
  function show_occurence_num(ndx) {
    
    var dim = ndx.dimension(dc.pluck("disaster_type"));
    var group = dim.group().reduceSum(dc.pluck("occurrence"));
    
    dc.numberDisplay("#occurrence_id")
      .formatNumber(d3.format(" "))
      .group(group)
  }
  
  function show_total_death_num(ndx) {
    var dim = ndx.dimension(dc.pluck("occurrence"));
    var group = dim.group().reduceSum(dc.pluck("total_deaths"));
    
    dc.numberDisplay("#total_deaths_id")
      .formatNumber(d3.format("   "))
      .group(group)

  }

  // Create a Stacked Bar-Chart of occurence of disaster_type by year.
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
    
  // Create a Line Graph of total_deaths by disaster_type by decade.
  function showDeathsPerDecade(ndx) {
    
    // Pluck data by decade and group total_deaths.
    var decade_dim = ndx.dimension(dc.pluck('decade'));
    var total_deaths_per_decade = decade_dim.group().reduceSum(dc.pluck('total_deaths'));

    // Create total_deaths_dimension
    var total_deaths_dim = ndx.dimension(dc.pluck('total_deaths'));
    
    // Create Scale (1900 - 2010)
    var minDecade = decade_dim.bottom(1)[0].decade;
    var maxDecade = decade_dim.top(1)[0].decade;
    var myScale = d3.scale.linear()
        .domain([minDecade, maxDecade])
        .range([0, 100])

    // Linegraph Variable 
    var chart = dc.lineChart("#linegraph")
    
    // baseMixin
    // General Chart Options + marginMixin
    chart
        .width(600)
        .height(400)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .title( d =>  `${d.value} Total Deaths in ${d.key}`);
    
    // Data Options
    chart
        .dimension(decade_dim)
        .group(total_deaths_per_decade);
    
    // Transition Option
    chart
        .transitionDuration(500);
    
    // coordinateGridMixin
    chart
        .brushOn(false)    
        .x(myScale)
        .xAxisLabel("Decade")
        .yAxisLabel("Total Deaths ('000)")
        .yAxis().ticks(4);
    }
      
  // Create a Pie Chart that shows total_damage ('000 ) per County.
  function showTotalDamagePerCountry(ndx) {
    
    // Pluck data by country_name
    var country_nameDim = ndx.dimension(dc.pluck("country_name"));
    var total_damageDim = country_nameDim.group().reduceSum(dc.pluck("total_damage"));
    
    // Pie Chart Variable
    var pieChart = dc.pieChart("#piechart")
    
    // baseMixin
    pieChart
      .height(500)
      .radius(150)
      .transitionDuration(1500)
      .dimension(country_nameDim)
      .group(total_damageDim)
      .title(function(d) {
        return `Total Damage('000) in ${d.key}: ${d.value} USD`
      });
    
    // colorMixin
    pieChart
      .colors(d3.scale.category20b());
  
  }
  
  // Create a Pie Chart that shows top 10 total_damage ('000 ) per County.
  function showTotalDamagePerCountryTop(ndx, data) {
  
    // Pluck data by country_name
    var country_name_dimension = ndx.dimension(dc.pluck("country_name"));
    var total_damage_dimension = country_name_dimension.group().reduceSum(dc.pluck("total_damage"));
    
    var pieChart = dc.pieChart("#piechart-1")
    
     pieChart
      .height(450)
      .width(600)
      .radius(200)
      .transitionDuration(1500)
      .dimension(country_name_dimension)
      .group(total_damage_dimension)
      .title(function(d) {
        return `Total Damage('000) in ${d.key}: ${d.value} USD`
      })
      .colors(d3.scale.category20b())
      .cap(10)
      .minAngleForLabel(360)
      .legend(
        dc.legend()
          .x(5)
          .y(5)
          .itemHeight(15)
          .gap(5));
  
}

  // Create a Pie Chart that shows bottom 10 total_damage ('000 ) per County.
//   function showTotalDamagePerCountryBottom(ndx, data) {
    
//     // Filter data and only rturn data piece whose total_damage > 24000
//     var filter = data.filter(function(item) {
//       return item.total_damage;
//     });
    
//     // Sort the filter array
//     var sort = filter.sort(function(a, b) {
//       return b.total_damage + a.total_damage;
//     });
    
//     console.log(sort)
//     // Create new crossfilter 
//     var ndx_bottom_total_damage = crossfilter(sort);
    
//     // Pluck data by country_name
//     var country_name_dimension = ndx_bottom_total_damage.dimension(dc.pluck("country_name"));
//     var total_damage_dimension = country_name_dimension.group().reduceSum(dc.pluck("total_damage"));
    
//     var pieChart = dc.pieChart("#piechart-2")
    
//     pieChart
//       .height(300)
//       .radius(100)
//       .transitionDuration(1500)
//       .dimension(country_name_dimension)
//       .group(total_damage_dimension)
//       .title(function(d) {
//         return `Total Damage('000) in ${d.key}: ${d.value} USD`
//       })
//       .colors(d3.scale.category20b())
//       .cap(5)
//       .minAngleForLabel(360)
//       .legend(
//         dc.legend()
//           .x(5)
//           .y(5)
//           .itemHeight(15)
//           .gap(5));
// }


