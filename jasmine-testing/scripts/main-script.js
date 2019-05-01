var methods = function(error,data){
    jqueryFunctions(data);
    // show_discipline_selector();
    show_country_selector();
    show_occurence_num();
    show_total_death_num();
    show_total_damage_num();
    showDisastersPerDecade();
    showDeathsPerDecade();
    showTotalDamagePerCountryTop();
};

function jqueryFunctions(data) {
    $(document).ready(function() {
      
      // Display Modal
      $('#ModalCenter').modal('show');
      
      // Menu Functions
      $("#close-btn").click(function(){
        $("#reset-btn").animate({opacity: "0"}, 250).css("display", "none");
        $("#disciplineSelector").animate({opacity: "0"}, 250).css("display", "none");
        $("#countrySelector").animate({opacity: "0"}, 250).css("display", "none");
        $(".menu").animate({height: '60px'}, 500);
        $(".menu").css("background-color", "rgba(0,0,0,0")
        $(".toggle-btn").addClass("row_one", 500);
        $("#close-btn").css("display", "none");
        $("#open-btn").css("display", "block").css("color", "rgb(57,59,121)");
      });  
      $("#open-btn").click(function(){
        $("#reset-btn").animate({opacity: "100"}, 250).css("display", "block");
        $("#disciplineSelector").animate({opacity: "100"}, 250).css("display", "block");
        $("#countrySelector").animate({opacity: "110"}, 250).css("display", "block");
        $(".menu").animate({height: '150px'}, 500).css("background-color", "rgba(57,59,121,1)");
        $(".toggle-btn").removeClass("row_one", 500);
        $("#close-btn").css("display", "block");
        $("#open-btn").css("display", "none");
      }); 
      
      $("#open-btn").hover(
        function() {
          $(this).animate({font: "200px"})
        }), function() {
          $(this).animate({color: "blue"})
        }
    })
  }
function show_discipline_selector() {
    var test = 1
}
function show_country_selector() {
     var test = 1
}
function show_occurence_num() {
 var test = 1
  }
function show_total_death_num() {
 var test = 1
  }
function show_total_damage_num() {
 var test = 1
  }
function showDisastersPerDecade(){
   var test = 1
    }
function showDeathsPerDecade() {
   var test = 1

    }
function showTotalDamagePerCountryTop() {
   var test = 1
}