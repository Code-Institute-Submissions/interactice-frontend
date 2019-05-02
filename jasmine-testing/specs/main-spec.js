describe("The methods() Function", 
function(){
    
    // beforeEach(function(){
    //     var method = new methods()
    // })
    
    it("should call jqueryFunctions()", function(){
        let jqueryFunctions = spyOn(window,'jqueryFunctions');
        methods();
            
        expect(jqueryFunctions).toHaveBeenCalled();
    })
    
    it("should also call show_discipline_selector()", function(){
        let show_discipline_selector = spyOn(window, 'show_discipline_selector')
        methods();
        
        expect(show_discipline_selector).toHaveBeenCalled();
    })
    it("should also call show_country_selector", function(){
        let show_country_selector = spyOn(window, "show_country_selector");
        methods();
        
        expect(show_country_selector).toHaveBeenCalled();
    })
    it("should also call show_occurence_num", function(){
        let show_occurence_num = spyOn(window, "show_occurence_num")
        methods();
        
        expect(show_occurence_num).toHaveBeenCalled();
    })
    it("should also call show_total_death_num", function(){
        let show_total_death_num = spyOn(window, "show_total_death_num")
        methods();
        
        expect(show_total_death_num).toHaveBeenCalled();
    })
    it("should also call show_total_damage_num", function(){
        let show_total_damage_num = spyOn(window, "show_total_damage_num")
        methods();
        
        expect(show_total_damage_num).toHaveBeenCalled();
    })
    it("should also call showDisastersPerDecade", function(){
        let showDisastersPerDecade = spyOn(window, 'showDisastersPerDecade');
        methods();
        expect(showDisastersPerDecade).toHaveBeenCalled();
    })
    it("should also call showDeathsPerDecade", function(){
        let showDeathsPerDecade = spyOn(window, "showDeathsPerDecade");
        methods();
        
        expect(showDeathsPerDecade).toHaveBeenCalled();
    })
    it("should also call showTotalDamagePerCountryTop", function(){
        let showTotalDamagePerCountryTop = spyOn(window, "showTotalDamagePerCountryTop");
        methods();
        
        expect(showTotalDamagePerCountryTop).toHaveBeenCalled();
    })
})

