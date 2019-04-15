describe("methods function", function() {
    
    it('should call the jqueryFunctions() function', function() {
        spyOn(window, "jqueryFunctions");
        
        methods();
        expect(window.jqueryFunctions).toHaveBeenCalled(); 
        
    })
})




// describe('methods function', function() {

    

//     it('calls show_discipline_selector function', function() {

//         // arrange

//         spyOn(window, 'show_discipline_selector');

        

//         // act

//         methods();

        

//         // assert

//         expect(window.show_discipline_selector).toHaveBeenCalled();  

//     });

 

// });