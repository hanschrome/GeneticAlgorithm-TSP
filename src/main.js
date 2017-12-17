const STATE_STOP = 0;
const STATE_PAUSED = 1;
const STATE_AUTOMATIC = 2;

const MSG_POKESTOPS = 'Añade las pokeparadas al mapa :)';

var canvas, ctx;
var WIDTH, HEIGHT;
var points = [];

var state;
var canvasMinX, canvasMinY;
var doPreciseMutate;

var POPULATION_SIZE;
var ELITE_RATE;
var CROSSOVER_PROBABILITY;
var MUTATION_PROBABILITY;
var OX_CROSSOVER_RATE;
var UNCHANGED_GENS;

var mutationTimes;
var dis;
var bestValue, best;
var currentGeneration;
var currentBest;
var population;
var values;
var fitnessValues;
var roulette;

$(function () {
    init();
    initData();
    $('#start_btn').click(function () {
        if (points.length >= 3) {
            initData();
            GAInitialize();
            state = STATE_AUTOMATIC;
        } else {
            alert(MSG_POKESTOPS);
        }
    });
    $('#clear_btn').click(function () {
        state = STATE_STOP;
        initData();
        points = new Array();
    });
    $('#stop_btn').click(function () {
        if (state !== STATE_AUTOMATIC && currentGeneration !== 0) {
            if (best.length !== points.length) {
                initData();
                GAInitialize();
            }
            state = STATE_AUTOMATIC;
        } else {
            state = STATE_PAUSED;
        }
    });
    $('#next_btn').click(function () {
        if (points.length >= 3) {
            if (state === STATE_STOP || best.length !== points.length) {
                initData();
                GAInitialize();
            } else {
                GANextGeneration();
            }

            state = STATE_PAUSED;
        } else {
            alert(MSG_POKESTOPS);
        }
    });
    $('#image_url').change(function () {
        $('#canvas').css('background-image', "url(" + $('#image_url').val() + ")");
    });
});

function init() {
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $('#canvas').width();
    HEIGHT = $('#canvas').height();
    state = STATE_STOP;
    setInterval(draw, 10);
    init_mouse();
}

function init_mouse() {
    $("canvas").click(function (evt) {
        if (state !== STATE_AUTOMATIC) {
            canvasMinX = $("#canvas").offset().left;
            canvasMinY = $("#canvas").offset().top;
            $('#status').text("");

            x = evt.pageX - canvasMinX;
            y = evt.pageY - canvasMinY;
            points.push(new Point(x, y));
        }
    });
}

function initData() {
    POPULATION_SIZE = 30;
    ELITE_RATE = 0.3;
    CROSSOVER_PROBABILITY = 0.9;
    MUTATION_PROBABILITY = 0.01;
    //OX_CROSSOVER_RATE = 0.05;
    UNCHANGED_GENS = 0;
    mutationTimes = 0;
    doPreciseMutate = true;

    bestValue = undefined;
    best = [];
    currentGeneration = 0;
    currentBest;
    population = []; //new Array(POPULATION_SIZE);
    values = new Array(POPULATION_SIZE);
    fitnessValues = new Array(POPULATION_SIZE);
    roulette = new Array(POPULATION_SIZE);
}

function drawCircle(point) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function drawLines(array) {
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(points[array[0]].x, points[array[0]].y);
    for (var i = 1; i < array.length; i++) {
        ctx.lineTo(points[array[i]].x, points[array[i]].y)
    }
    ctx.lineTo(points[array[0]].x, points[array[0]].y);

    ctx.stroke();
    ctx.closePath();
}

function draw() {
    var text;
    text = "Hay " + points.length + " pokeparadas en el mapa. ";
    if (state === STATE_AUTOMATIC) {
        GANextGeneration();
        text += currentGeneration + "ª generación con "
            + mutationTimes + " mutaciones. Mejor valor: "
            + ~~(bestValue);
    } else if (state === STATE_PAUSED) {
        text += currentGeneration + "ª generación con "
            + mutationTimes + " mutaciones. Mejor valor: "
            + ~~(bestValue);
    }

    $('#status').text(text);

    clearCanvas();
    if (points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            drawCircle(points[i]);
        }
        if (best.length === points.length) {
            drawLines(best);
        }
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
