var canvas = document.getElementById('sim');
const cw = canvas.width;
const ch = canvas.height;
var ctx = canvas.getContext('2d');

//this is a asexual simulation so no matting just mutating

//helper function for creature movement
function normilze(x, y) {
    return Math.sqrt(x * x + y * y);
}

//if a creature touches a food it regains hp
//evolution attributes:
//radius - radius determines the speed inversly maybe speed = 1/radius or something else
//hp - hp is reduced every time interval - the less base hp the shorter the reproduce timer is

let creatures = [];
let food = [];

class Creature {
    constructor(x, y, radius, hp, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.hp = hp;
        this.color = color;
        this.reproduceTimer = this.hp + 1;
        this.initReproduceTimer = this.reproduceTimer;
        //these are more like direction instead of velocity maybe rename these
        this.vx = Math.random() - .5;
        this.vy = Math.random() - .5;
    }

    update() {
        this.hp -= .1;
        this.reproduceTimer -= .1;
        if (this.reproduceTimer <= 0) {
            this.reproduceTimer = this.initReproduceTimer;
            let x = this.x + (Math.random() - .5) * 5;
            let y = this.y + (Math.random() - .5) * 5;
            let rad = this.radius + (Math.random() - .5) * 2.5;
            let hp = this.hp + (Math.random() - .5) * 2.5;
            creatures.push(new Creature(x, y, rad, hp, 'red'));
        }
        //Movement
        //Currently this is random, maybe go to nearest food?
        if (this.x <= 0 || this.x >= cw) {
            this.vx *= -1;
        }
        if (this.y <= 0 || this.y >= ch) {
            this.vy *= -1;
        }
        //10/this.radius is the speed
        //10 is just a shitty random number
        let len = normilze(this.vx, this.vy);
        this.x += (this.vx / len) * 30 / this.radius;
        this.y += (this.vy / len) * 30 / this.radius;

        //check to see if we are over a food
        for (let i = food.length - 1; i >= 0; i--) {
            let dx = this.x - food[i].x;
            let dy = this.y - food[i].y;
            let dist = normilze(dx, dy);
            //3 is food radius 10 is food hp gained
            if (dist < this.radius + 3) {
                this.hp += 10;
                food.splice(i, 1);
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

//Hard-coded magic number radius of 3
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}

//30 is the amount of creatures
for (var i = 0; i < 30; i++) {
    //for some reason js doesnt like randomness in the constructor
    //wack
    let x = Math.random() * cw;
    let y = Math.random() * ch;
    let rad = Math.random() * 25 + 10;
    let hp = Math.random() * 30 + 10;
    creatures.push(new Creature(x, y, rad, hp, 'red'));
}

for (var i = 0; i < 30; i++) {
    let x = Math.random() * cw;
    let y = Math.random() * ch;
    food.push(new Food(x, y));
}

function update() {
    ctx.clearRect(0, 0, cw, ch);
    for (var i = creatures.length - 1; i >= 0; i--) {
        if (creatures[i].hp <= 0) {
            creatures.splice(i, 1);
        }
        creatures[i].update();
        creatures[i].draw();
    }
    for (var i = 0; i < food.length; i++) {
        food[i].draw();
    }
    let newFood = Math.random();
    if (newFood <= .25) {
        let x = Math.random() * cw;
        let y = Math.random() * ch;
        food.push(new Food(x, y));
    }
}

setInterval(update, 1000 / 60);