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
