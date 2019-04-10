describe("queue method"), function() {
    
    it('calls methods() function', function() {
        
        
        spyOn(window, "methods");
        
        queue();
        
        expect(window.methods).toHaveBeenCalled();  
        
        
    })
}




describe('methods function', function() {

    

    it('calls show_discipline_selector function', function() {

        // arrange

        spyOn(window, 'show_discipline_selector');

        

        // act

        methods();

        

        // assert

        expect(window.show_discipline_selector).toHaveBeenCalled();  

    });

 

});