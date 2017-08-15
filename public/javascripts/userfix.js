// need to add ajax request to update each fixture availability in mongod
$('.userList').on("click", function(e){

    const fixtureId = $(e.target).next().children(".fixId").html();

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": window.location.href,
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
        },
        "data": {
            "fixtureId": fixtureId,
        }
    }
    
    const self = this;

    $.ajax(settings).done(function (response) {
        if (response == "Not Available"){
            $(self).removeClass();
            $(self).addClass('red userList col-xs-6');
            $(self).children().children(".availability").html(response);
        } else if (response == "Not Set"){
            $(self).removeClass();
            $(self).addClass('blue userList col-xs-6');
            $(self).children().children(".availability").html(response);
        } else if (response == "Available"){
            $(self).removeClass();
            $(self).addClass('green userList col-xs-6');
            $(self).children().children(".availability").html(response);
        }
    });
});

$(document).ready(function(){
    $('.userList').each(function(){
        const availability = $(this).children().children(".availability").html();
        if (availability === "Not Available"){
            $(this).removeClass();
            $(this).addClass('red userList col-xs-6');
        } else if (availability === "Available"){
            $(this).removeClass();
            $(this).addClass('green userList col-xs-6');
        } else if (availability === "Not Set"){
            $(this).removeClass();
            $(this).addClass('blue userList col-xs-6');
        } 
    });
});