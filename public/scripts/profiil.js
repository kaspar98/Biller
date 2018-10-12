// FIND ALL FRIENDS AJAX
document.getElementById('findAllFriends').addEventListener('click', loadUsers);

function loadUsers() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/profiil/allfriends', true);

    xhr.onload = function () {
        if (this.status == 200) {
            var users = JSON.parse(this.responseText)["friends"];
            var output = '';
            for (var i in users) {
                output += '<ul>' +
                    '<li>' + users[i].firstName + ' ' + users[i].lastName + ' (' + users[i].username + ')' +  '</li>' +
                    '</ul>';
            }
            document.location.hash = "allfriends";
            document.getElementById('users').innerHTML = output;
        }
    };

    xhr.send();
}

// BOOKMARKS
var recentHash = "";
var checkHash = function () {
    var hash = document.location.hash;
    if (hash) {
        hash = hash.substr(1);
        if (hash == recentHash) {
            return;
        }
        recentHash = hash;
        loadUsers();
    } else {
        document.getElementById('users').innerHTML = "";
    }
};
checkHash();


// BACK BUTTON FIX
window.onhashchange = function() {
    if(!document.location.hash){
        history.back();
    } else{
        history.forward();
    }
};