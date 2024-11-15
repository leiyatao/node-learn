var myModule = { function(){
    var myVariable="This is my variable";
    function myFunction(){
        console.log(myVariable);
    }
    return function(){
        myFunction();
    }
}}();

myModule();
console.log(myModule.myVariable)