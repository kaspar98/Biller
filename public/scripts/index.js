// Array.from(document.getElementsByClassName("addPayerForm")).forEach(function (element) {
//     element.addEventListener('submit', postPayer);
// });
//
// function postPayer(e) {
//     e.preventDefault();
//
//     var payerName = e.target.elements["friendName"].value;
//     var payerAmount = e.target.elements["friendPayAmount"].value;
//     var payerEventId = e.target.elements["eventIdAddPayer"].value;
//     var payerInfo = {
//         friendName: payerName,
//         friendPayAmount: payerAmount,
//         eventIdAddPayer: payerEventId
//     };
//
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "/addpayer", true);
//     xhr.setRequestHeader("Content-type", "application/json");
//     xhr.onload = function () {
//         if (this.status == 200) {
//             console.log(JSON.parse(this.responseText)["msg"]);
//         }
//     };
//
//     xhr.send(JSON.stringify(payerInfo));
// }
//

var events = [];
document.getElementById("addEventForm").addEventListener("submit", (function (e) {
        e.preventDefault();
        let event = {
            title: e.target.elements["title"].value,
            eventDescription: e.target.elements["eventDescription"].value
        };
        addEvent(event);
    })
);

function addEvent(event) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/addevent", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function () {
        if (this.status == 200 && JSON.parse(this.responseText)["status"] == 200) {
            console.log("EVENT ADDED");
            var index = events.indexOf(event);
            if (index > -1) {
                events.splice(index, 1);
            }
            alert(JSON.parse(this.responseText)["msg"]);
        } else {
            console.log("ADDING FAILED");
            if (!events.includes(event)) {
                events.push(event);
                alert(JSON.parse(this.responseText)["msg"]);
            }
        }
    };
    xhr.send(JSON.stringify(event));
}

setInterval(function () {
    events.forEach((event) => {
        addEvent(event);
    })
}, 2000);


