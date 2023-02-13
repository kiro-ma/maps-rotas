function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function fetchFactory(method, url, body) {
    let dataReturned
    let init = {
        method: method,
        headers: {},
    }
    if (method == 'GET') {
        init.headers = {
            'X-CSRFToken': getCookie("csrftoken")
        }
    } else {
        init.headers = {
            'X-CSRFToken': getCookie("csrftoken"),
            'Content-Type': 'application/json'
        }
        init = Object.assign(init, { body: JSON.stringify(body) })
    }
    await fetch(url, init)
        .then(response => response.json())
        .then(dataResponse => dataReturned = dataResponse)
    return dataReturned

    // fetch(url, {
    //     method:'POST',
    //     headers:{
    //         'Content-Type':'application/json',
    //         'X-CSRFToken':csrftoken,
    //     }, 
    //     body:JSON.stringify({'productId':productId, 'action':action})
    // })
    // .then((response) => {
    //    return response.json();
    // })
    // .then((data) => {
    //     location.reload()
    // });
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: { lat: -5.088733, lng: -42.807476 }
    });
    infoWindow = new google.maps.InfoWindow();

    var controlDiv = document.createElement('div');

    var locationButton = document.createElement('button');
    locationButton.style.backgroundColor = '#fff';
    locationButton.style.border = 'none';
    locationButton.style.outline = 'none';
    locationButton.style.width = '28px';
    locationButton.style.height = '28px';
    locationButton.style.borderRadius = '2px';
    locationButton.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    locationButton.style.cursor = 'pointer';
    locationButton.style.marginRight = '10px';
    locationButton.style.padding = '0';
    locationButton.title = 'Your Location';
    controlDiv.appendChild(locationButton);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    locationButton.appendChild(secondChild);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Local aproximado.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                    map.setZoom(16)
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function clearRoute(clear_inputs) {
    initMap()
    document.getElementById("panel").innerHTML = "";
    if (clear_inputs) {
        document.getElementById("total").innerHTML = "";
        document.getElementById("start").value = "";
        document.getElementById("end").value = "";

        let waypoints = document.getElementsByClassName("waypoint")

        for (let i = 0; i < waypoints.length; i++) {
            waypoints[i].value = ""
        }
    }
}

function displayRoute(origin, destination, waypoints, service, display) {
    service
        .route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true,
            waypoints: waypoints,
        })
        .then((result) => {
            display.setDirections(result);
        })
        .catch((e) => {
            alert("Não foi possível mostrar rota: " + e);
        });
}

function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }

    total = total / 1000;
    document.getElementById("total").innerHTML = total + " km";
}

window.initMap = initMap;

function getWaypointsInputs() {
    return document.getElementsByClassName("waypoint");
}

function get_paradas(obj) {
    let paradas = [];
    const inputs = getWaypointsInputs();

    for (let i = 0; i < inputs.length; i++) {
        if (obj) {
            if (inputs[i].value) {
                paradas.push({ location: inputs[i].value });
            }
        } else { paradas.push(inputs[i]) }
    }
    return paradas
}

const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

const testSleep = async () => {
    //console.log('Step 1 - Called');
    await sleep(5000);
    //console.log('Step 2 - Called');
}

function addRouteToTable(nome, dataReceived) {
    var nome_rota
    var t = $('#tableRotas').DataTable();
    var waypoints = []

    if (nome) {
        nome_rota = nome
    } else { nome_rota = 'Rota sem nome' }

    if (dataReceived) {
        data = dataReceived
        $('#tableRotas').DataTable().clear().draw();
        for (let i = 0; i < data.length; i++) {
            //waypoints.push(data[i]['waypoints'])
            t.row.add([data[i]['name'], data[i]['start'], data[i]['waypoints'], data[i]['end']]).draw(true)
        }
    } else {
        data = getRouteData();
        for (let index = 0; index < data['waypoints'].length; index++) {
            waypoints.push(data['waypoints'][index]['location'])
        }
        t.row.add([nome_rota, data['start'], waypoints, data['end']]).draw(true);
    }
    salvarRotas()
}

function nameRoute() {
    document.getElementById('nome_da_rota').value = document.getElementById('start').value + '/' + document.getElementById('end').value
}

function getRouteData() {
    return {
        key: "AIzaSyBrFPwh63aik8WO4PQMdjiUCEQrRxg9r-U",
        start: document.getElementById('start').value,
        end: document.getElementById('end').value,
        waypoints: get_paradas(true)
    };
}

function addRoute(data) {

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map,
        panel: document.getElementById("panel"),
    });

    directionsRenderer.addListener("directions_changed", () => {
        const directions = directionsRenderer.getDirections();

        if (directions) {
            computeTotalDistance(directions);
        }
    });

    displayRoute(data['start'], data['end'], data['waypoints'], directionsService, directionsRenderer);

}

function closeAlert() {
    var alertNode = document.querySelector('.alert')
    alertNode.classList.remove('show')
    alertNode.style = 'display: none'
}

function showAlert() {
    var alertNode = document.querySelector('.alert')
    alertNode.classList.add('show')
    alertNode.style = ''
}

async function run_route(clear) {
    data = getRouteData()
    if (data['start'] != '' && data['end'] != '') {

        if (clear) {
            clearRoute(true)
        } else { clearRoute() }

        addRoute(data)

        nameRoute()
    } else { showAlert() }
    // url = 'get/'
    // console.log(await fetchFactory('POST', url, data))
}

function fillRouteForm(data) {
    document.getElementById('start').value = data['start']
    document.getElementById('end').value = data['end']

    if (data['waypoints'].length > 0) {
        for (let i = 0; i < data['waypoints'].length; i++) {
            if (getWaypointsInputs().length < data['waypoints'].length) { document.getElementById('rowAdder').click() }
        }

        let inputs = getWaypointsInputs()

        for (let i = 0; i < data['waypoints'].length; i++) {
            inputs[i].value = data['waypoints'][i].location
        }
    }
}

function salvarRotas() {
    var table = $('#tableRotas').DataTable();
    var data = table.rows().data();
    var dataOBJ = []

    for (let i = 0; i < data.length; i++) {
        dataOBJ.push({
            name: data[i][0],
            start: data[i][1],
            end: data[i][3],
            waypoints: data[i][2]
        })
    }

    localStorage.setItem("table", JSON.stringify(dataOBJ));
}

function carregarRotas() {
    const table = localStorage.getItem("table");
    download('table.txt', table)
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {

    let obj = JSON.parse(localStorage.getItem("table"))
    addRouteToTable(obj['name'], obj)

    var table = $('#tableRotas').DataTable();
    $('#tableRotas tbody').on('click', 'td', function () {
        var routeData = table.row(this).data()
        let paradas = []
        for (let i = 0; i < routeData[2].length; i++) {
            paradas.push({ location: routeData[2][i] })
        }

        data = {
            key: "AIzaSyBrFPwh63aik8WO4PQMdjiUCEQrRxg9r-U",
            start: routeData[1],
            end: routeData[3],
            waypoints: paradas
        }
        clearRoute()
        addRoute(data)
        fillRouteForm(data)
    });
    $("#tableRotas tbody").on('click', 'button.btnDelete', function () {
        table.row($(this).parents('tr')).remove().draw();
        salvarRotas()
    });
    
});


document.getElementById('input-file').addEventListener('change', getFile)

function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
            document.getElementById('content-target'),
            input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        let obj = JSON.parse(content)
        addRouteToTable(obj['name'], obj)
    }).catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}


$("#rowAdder").click(function () {
    paradas = get_paradas()
    newRowAdd =
        `<div id="row">
                    <div style="margin-top: 5px; margin-bottom: 5px;">
                        <div class="input-group m-0">
                            <span class="input-group-text" style="background-color: #131313; color: white; border: 0; width: 12%" id="">Parada ${paradas.length + 1}</span>

                            <input type="text" class="form-control waypoint"
                                style="background-color: #222222; color: white; border: 0;"
                                placeholder="Digite uma parada" aria-label="" aria-describedby="basic-addon1">
                            <div class="input-group-prepend">

                                <button class="btn btn-outline-light" id="DeleteRow" title="Remover"
                                    type="button"><i class="bi bi-trash3"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`
    $('#newinput').append(newRowAdd);
});

$("body").on("click", "#DeleteRow", function () {
    $(this).parents("#row").remove();
})
