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
