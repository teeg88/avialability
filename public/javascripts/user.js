$('document').ready(function(){
    $(".delete").on('click', function(e){
        e.preventDefault();
        let user_id = $(e.target).parent().prev().html();

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:3000/users/" + user_id,
            "method": "DELETE",
            "headers": {
              "content-type": "application/x-www-form-urlencoded",
            }
          }
          
          $.ajax(settings).done(function (response) {
            $(e.target).parent().parent().remove();
            console.log(response);
          });

        
    })
});