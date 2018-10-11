Array.from(document.getElementsByClassName("addPayerForm")).forEach(function(element) {
    element.addEventListener('submit', postPayer);
});

function postPayer(e) {
    e.preventDefault();

    var payerName = e.target.elements["friendName"].value;
    var payerAmount = e.target.elements["friendPayAmount"].value;
    var payerEventId = e.target.elements["eventIdAddPayer"].value;
    var payerInfo = {
        friendName: payerName,
        friendPayAmount: payerAmount,
        eventIdAddPayer: payerEventId
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/addpayer", true);
    xhr.setRequestHeader("Content-type", "application/json");
    // xhr.onload = function() {
    //     if(this.status == 200){
    //         console.log(JSON.parse(this.responseText)["msg"]);
    //     }
    // };

    xhr.send(JSON.stringify(payerInfo));
}
