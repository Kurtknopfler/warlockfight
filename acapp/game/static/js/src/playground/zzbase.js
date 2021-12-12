class MyGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>游戏界面</div>`);

        this.hide();
        this.root.$my_game.append(this.$playground);

        this.start();
    }

    start() {

    }

    show() {  // 打开playground 界面
        this.$playground.show();
    }

    hide() { // 关闭 playground 界面
        this.$playground.hide();
    }


}
