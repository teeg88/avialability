const fix = document.getElementById('fixtures');

function deleteFixture(id, parent){
    
    var data = "id=" + id;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status == 200) {
            document.getElementById('response').innerHTML = this.responseText;
            parent.remove();
        }
    });

    xhr.open("DELETE", "http://localhost:3000/fixtures");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  
    xhr.send(data);
}

