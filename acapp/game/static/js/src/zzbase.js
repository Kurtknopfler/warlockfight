class MyGame {
    constructor(id){
        this.id = id;
        this.$my_game = $('#' + id);
        this.menu = new MyGameMenu(this);
        this.playground = new MyGamePlayground(this);

        this.start();
    }

    start() {

    }
}
