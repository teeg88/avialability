// need to add ajax request to update each fixture availability in mongod
$('.userList').on("click", function(e){
    if ($(this).hasClass('blue')){
        $(this).removeClass('blue');
        $(this).addClass('green');
        console.log('Available');
    } else if ($(this).hasClass('green')){
        $(this).removeClass('green');
        $(this).addClass('red');
        console.log('Not Available');
    } else if ($(this).hasClass('red')){
        $(this).removeClass('red');
        $(this).addClass('blue');
        console.log('Not Set');
    }
});