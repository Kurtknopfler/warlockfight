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
