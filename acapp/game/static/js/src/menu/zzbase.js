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
            console.log("click single-mode");
        });

        this.$multi_mode.click(function(){
            console.log("click multi-mode");
        });

        this.$settings.click(function(){
            console.log("click settings");
        });
    }

}
