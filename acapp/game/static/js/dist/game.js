class MyGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
<div class="my-game-menu">
    <div class="my-game-menu-field">
        <div class="my-game-menu-field-item my-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="my-game-menu-field-item my-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
`);
        this.root.$my_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.my-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.my-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.my-game-menu-field-item-settings');

        this.start();

    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });

        this.$multi_mode.click(function(){
            console.log("click multi-mode");
        });

        this.$settings.click(function(){
            console.log("click settings");
        });
    }

    show() {  //展示菜单页面
        this.$menu.show();
    }

    hide() {  //隐藏菜单页面
        this.$menu.hide();
    }

}
let MY_GAME_OBJECTS = [];

class MyGameObject {
    constructor(){
        MY_GAME_OBJECTS.push(this);

        this.has_called_start = false;  //是否执行过 start()
        this.timedelta = 0;  //当前距离上一帧的时间间隔
    }

    start(){  // 只会在第一帧执行一次

    }

    update() { // 每一帧都会执行一次

    }

    on_destory() {  //在被销毁之前执行一次

    }

    destory() {  //删掉该物体

        this.on_destory();

        for (let i = 0; i < MY_GAME_OBJECTS.length; i ++) {
            if (MY_GAME_OBJECTS[i] === this){
                MY_GAME_OBJECTS.splice(i, 1);
                break;
            }

        }
    }
}

let last_timestamp;
let MY_GAME_ANIMATION = function(timestamp) {

    for( let i = 0; i < MY_GAME_OBJECTS.length; i ++) {
        let obj = MY_GAME_OBJECTS[i];
        if ( !obj.has_called_start ) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(MY_GAME_ANIMATION);
}

requestAnimationFrame(MY_GAME_ANIMATION);
class GameMap extends MyGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext(`2d`);
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }


    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}
class Particle extends MyGameObject {
    constructor (playground, x, y, radius, vx, vy, color, speed, move_length){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.firction = 0.9;
        this.eps = 1;
        this.move_length = move_length;
    }

    start() {

    }

    update() {
        if( this.move_length < this.eps || this.speed < this.eps) {
            this.destory();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.firction;
        this.move_length -= moved;
        this.render();

    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class Player extends MyGameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.friction = 0.9;
        this.spend_time = 0;
        this.cur_skill = null;
        this.is_dead = false;
        this.frozen_time = 0;
        this.origin_color = color;
    }

    start() {
        if( this.is_me){
            this.add_listening_events();
        }
        else
        {
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });

        this.playground.game_map.$canvas.mousedown(function(e){
            if( e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if ( e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                else if( outer.cur_skill === "iceball") {
                    outer.shoot_iceball(e.clientX, e.clientY);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function(e) { // press Q, release fireball skill
            if( e.which === 81) { // Q
                outer.cur_skill = "fireball";
                return false;
            }
        });

        $(window).keydown(function(e) { // press W, release iceball skill
            if(e.which === 87) { // W
                outer.cur_skill = "iceball";
                return false;
            }

        });


    }

    shoot_fireball(tx, ty) {
        if( this.is_dead) {
            return ;
        }
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    shoot_iceball(tx, ty) {
        if(this.is_dead) {
            return ;
        }
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = 'rgb(0, 255, 255)';
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 0.7;
        new IceBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);
    }


    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, tx, this.y, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        for( let i = 0; i < 10 + Math.random() * 10; i ++){  // 被击中时释放特效
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.2;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 8;
            let move_length = this.radius * Math.random() * 7;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
            this.radius -= damage;
            if( this.radius < 10) {
                this.destory();
                return false;
            }
            this.speed *= 0.6;
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage * 80;

    }


    update() {
        this.spend_time += this.timedelta / 1000;
        if( this.color !== this.origin_color) {
            this.frozen_time += this.timedelta / 1000;
        }
        if( !this.is_me && this.spend_time > 4 && Math.random() < 1 / 180.0){
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            this.shoot_fireball(player.x, player.y);
            if( Math.floor(Math.random() * 2) > 0) {
                this.shoot_fireball(player.x, player.y);
            } else {
                this.shoot_iceball(player.x, player.y);
            }

        }

        if( this.frozen_time > 2) {
            this.speed = this.playground.height * 0.15;
            this.color = this.origin_color;
            this.frozen_time = 0;
        }


        if( this.damage_speed > 10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else{
            if( this.move_length < this.eps){
                this.move_length = 0;
                this.vx = this.vy = 0;
                if( !this.is_me){
                    let tx = Math.random() * this.playground.width;
                    let ty = Math.random() * this.playground.height;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
            this.x += this.vx;
            this.y += this.vy;
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destory(){
        this.is_dead = true;
        for( let i = 0; i < this.playground.players.length; i ++){
            if( this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}
class IceBall extends MyGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = radius;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.1;
        this.damage = damage;
        this.distance = 0;
    }

    start(){

    }

    update() {
        if(this.move_length < this.eps) {
            this.destory();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for(let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if( this.player !== player && this.is_collision(player)) {
                console.log(i);
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) { // get distance between iceball and player
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    is_collision(player) {
        this.distance = this.get_dist(this.x, this.y, player.x, player.y);
        if ( this.distance < (this.radius + player.radius)) {
            return true;
        }

        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        player.speed = 0;
        player.color = this.color;
        this.destory();
    }

    render() { // draw iceball
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }



}
class FireBall extends MyGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.1;
        this.damage = damage;
        this.distance = 0;
    }

    start() {

    }

    update() {
        if( this.move_length < this.eps ) {
            this.destory();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for(let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if(this.player !== player && this.is_collision(player)) {
                console.log(i);
                this.attack(player);

            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        this.distance = this.get_dist(this.x, this.y, player.x, player.y);
        if( this.distance < this.radius + player.radius ) {
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked( angle, this.damage);
        this.destory();

    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class MyGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div class="my-game-playground"></div>`);

        //this.hide();
        this.root.$my_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for(let i = 0; i < 15; i ++) {
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

        this.start();
    }

    start() {

    }

    show() {  // 打开playground 界面
        this.$playground.show();
    }

    get_random_color() {
        let colors = ['rgb(254, 67, 101)', 'rgb(252, 157, 154)', 'rgb(131, 175, 155)', 'rgb(249, 205, 173)', 'rgb(244, 208, 0)', 'rgb(69, 137, 148)', 'rgb(0, 90, 171)'];
        return colors[Math.floor(Math.random() * 7)];
    }

    hide() { // 关闭 playground 界面
        this.$playground.hide();
    }


}
export class MyGame {
    constructor(id){
        this.id = id;
        this.$my_game = $('#' + id);
        // this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }

    start() {

    }
}
