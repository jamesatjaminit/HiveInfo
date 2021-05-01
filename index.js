function fade(element) {
    var op = 0.1 // initial opacity
    element.style.display = 'block'
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer)
        }
        element.style.opacity = op
        element.style.filter = 'alpha(opacity=' + op * 100 + ')'
        op += op * 0.1
    }, 10)
    document.getElementById('loader').style.display = 'none'
}

function initLineGraph() {
    const labels = []
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Hive',
                backgroundColor: 'rgb(180, 225, 255)',
                borderColor: 'rgb(180, 225, 255)',
                data: [],
            },
        ],
    }
    const config = {
        type: 'line',
        data,
        scales: {},
    }
    return new Chart(document.getElementById('hiveChartLine'), config)
}
function updateLineGraph(chart, playerCount) {
    let time = new Date(Date.now())
    chart.data.labels.push(
        time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
    )
    chart.data.datasets[0].data.push(playerCount)
    chart.update()
}
function initPieChart() {
    const data = {
        labels: ['Mineplex', 'Lifeboat', 'CubeCraft', 'Hive', 'Galaxite'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [],
                backgroundColor: [
                    'rgb(237, 222, 164)',
                    'rgb(171, 135, 255)',
                    'rgb(255, 172, 228)',
                    'rgb(180, 225, 255)',
                    'rgb(193, 255, 155)',
                ],
                hoverOffset: 4,
            },
        ],
    }
    const config = {
        type: 'pie',
        data: data,
    }
    return new Chart(document.getElementById('hiveChartPie'), config)
}
function updatePieGraph(
    chart,
    playerCount1,
    PlayerCount2,
    PlayerCount3,
    PlayerCount4,
    PlayerCount5
) {
    chart.data.datasets[0].data = [
        playerCount1,
        PlayerCount2,
        PlayerCount3,
        PlayerCount4,
        PlayerCount5,
    ]
    chart.update()
}

let socket = new WebSocket('wss://bedrock.minetrack.me/')
socket.onopen = function (e) {
    console.log('Established connection to minetrack')
    this.HiveChartLine = initLineGraph()
    this.ChartPie = initPieChart()
}

socket.onmessage = function (event) {
    let data = JSON.parse(event.data)
    if (!data.updates) return
    let MineplexPlayerCount = data.updates[0].playerCount
    let LifeboatPlayerCount = data.updates[1].playerCount
    let CubePlayerCount = data.updates[3].playerCount
    let HivePlayerCount = data.updates[4].playerCount
    let GalaxitePlayerCount = data.updates[6].playerCount
    document.getElementById('hivePlayerCount').innerHTML = HivePlayerCount
    if (this.HiveChartLine) {
        updateLineGraph(this.HiveChartLine, HivePlayerCount)
    }
    if (this.ChartPie) {
        updatePieGraph(
            this.ChartPie,
            MineplexPlayerCount,
            LifeboatPlayerCount,
            CubePlayerCount,
            HivePlayerCount,
            GalaxitePlayerCount
        )
    }
    if (!this.faded) {
        fade(document.getElementById('graphs'))
        this.faded = true
    }
}

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        )
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('Connection was lost to websocket')
    }
}

socket.onerror = function (error) {
    console.error(error.message)
}
function setupGraph() {}
