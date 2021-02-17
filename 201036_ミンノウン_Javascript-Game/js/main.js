enchant();

let main_x = 0;
let main_y = 0;
let pn = 7;
let agg = 0;
let s1 = 0;
let s2 = 0;
let over = 0;
let spd = 3;
let t = 0;
let pn0 = 31;
let cooltime = 10;
let score = 0;
let bp = 0;
let bc = 0;

let max_b = 80;
let max_e = 15;
let started = 0;

window.onload = function () {
    game = new Core(300, 450);
    game.preload('../images/space0.png', '../images/bg.jpg', '../images/space2.png', '../images/effect0.png', '../images/icon0.png', '../images/start.png', '../images/gameover.png');

    game.keybind(38, 'a');
    game.keybind(90, 'a');
    game.fps = 30;

    game.onload = function () {
        bul_dat = new Array();
        for (var i = 0; i < 10; i++) {
            bul_dat[i] = new Array();
        }

        ene_dat = new Array();
        for (var i = 0; i < max_e; i++) {
            ene_dat[i] = new Array();
        }

        bang = new Array();
        for (var i = 0; i < max_e; i++) {
            bang[i] = new Array();
            bang_Pat = [0, 7, 13, 21, 40, 47, 58];
        }

        e_bullet = new Array();
        for (var i = 0; i < max_b; i++) {
            e_bullet[i] = new Array();
            for (var j = 0; j < 6; j++) {
                e_bullet[i][j] = 0;
            }
        }

        bg = new Sprite(320, 480);
        bg.image = game.assets['../images/bg.jpg'];
        bg.frame = 3;

        sco = new Label();
        sco.color = '#fff'
        sco.text = score;
        sco.x = 250;
        sco.y = 10;

        startbutton = new Sprite(236, 48);
        startbutton.image = game.assets['../images/start.png'];
        startbutton.x = 32;
        startbutton.y = 150;

        Gameover = new Sprite(189, 97);
        Gameover.image = game.assets['../images/gameover.png'];
        Gameover.x = 56;
        Gameover.y = -130;

        rocket = new Sprite(32, 64);
        rocket.image = game.assets['../images/space0.png'];
        main_x = game.width / 2 - 16;
        main_y = game.height - rocket.height - 10;
        rocket.y = main_y;
        rocket.x = main_x;

        bomb = Array(30);
        for (var i = 0; i < 30; i++) {
            bomb[i] = new Sprite(16, 16);
            bomb[i].y = -100;
            bomb[i].image = game.assets['../images/effect0.png'];
        }

        bullet = Array(30);
        for (var i = 0; i < 30; i++) {
            bullet[i] = new Sprite(16, 16);
            bullet[i].y = -100;
            bullet[i].image = game.assets['../images/icon0.png'];
            bullet[i].frame = 60;
        }

        enemy_bullet = Array(90);
        for (var i = 0; i < 90; i++) {
            enemy_bullet[i] = new Sprite(16, 16);
            enemy_bullet[i].y = -100;
            enemy_bullet[i].image = game.assets['../images/icon0.png'];
            enemy_bullet[i].frame = 47;
        }

        enemy = Array(30);
        for (var i = 0; i < 30; i++) {
            enemy[i] = new Sprite(32, 32);
            enemy[i].image = game.assets['../images/space2.png'];
            enemy[i].frame = 1;
            enemy[i].y = -100;
        }

        bg.addEventListener(enchant.Event.ENTER_FRAME, function (e) {
            if (started) mainLoop();
        });
        startbutton.addEventListener(enchant.Event.TOUCH_START, function () {
            startbutton.y = -200;
            started = 1;
        });

        game.rootScene.addChild(bg);
        game.rootScene.addChild(rocket);

        for (var i = 0; i < 30; i++) {
            game.rootScene.addChild(enemy[i]);
            game.rootScene.addChild(bomb[i]);
            game.rootScene.addChild(bullet[i]);
            game.rootScene.addChild(enemy_bullet[i]);
            game.rootScene.addChild(enemy_bullet[i + 30]);
            game.rootScene.addChild(enemy_bullet[i + 60]);
        }
        game.rootScene.addChild(sco);
        game.rootScene.addChild(Gameover);
        game.rootScene.addChild(startbutton);

    }
    game.start();

    function mainLoop() {
        rocket.frame = Math.floor(pn0 / 4);
        if (rocket.x + 25 < game.width)
            if (game.input.right) {
                main_x = main_x + spd;
                if (pn0 < 62) pn0 = pn0 + 2;
                rocket.x = main_x;
            }

        if (rocket.x > 0)
            if (game.input.left) {
                main_x = main_x - spd;
                if (pn0 > 2) pn0 = pn0 - 2;
                rocket.x = main_x;
            }

        if (pn0 < 31) pn0 = pn0 + 1;
        if (pn0 > 31) pn0 = pn0 - 1;


        if (game.input.a) shoot();
        if (!game.input.a)
            if (bc > 0) bc = bc - 2;

        moveBullet();
        moveEnemy();
        doBang();
        doAttack();

        if (bc > 0) bc = bc - 1;
    }

    function shoot() {
        if (bc <= 0 && over == 0) {
            bp = (bp + 1) % 10;
            bul_dat[bp][0] = 1;
            bul_dat[bp][1] = main_x + 20;
            bul_dat[bp][2] = main_y - 10;
            bc = cooltime;
            agg = agg + 2;
            s2++;
        }
    }

    function moveBullet() {
        for (var i = 0; i < 10; i++) {
            if (bul_dat[i][0] == 1) {
                bul_dat[i][2] = bul_dat[i][2] - 10;
                if (bul_dat[i][2] < -30) bul_dat[i][0] = 0;
            } else bul_dat[i][2] = -100;
            bullet[i].x = bul_dat[i][1] - 13;
            bullet[i].y = bul_dat[i][2];
        }
    }

    function moveEnemy() {
        for (var i = 0; i < max_e; i++) {
            if (ene_dat[i][0] == 1) {
                ene_dat[i][2] = ene_dat[i][2] + 1;
                ene_dat[i][3] = 0;
                if (ene_dat[i][2] > game.height) ene_dat[i][0] = 0;
                if (hitEnemy(i) == 1) bangEnemy(i);
                if (Math.random() * (300 - ((Math.floor(agg / 100)) % 5) * 60) < (Math.floor(agg / 1000)) + 1) attackRocket(i);
            } else {
                if (Math.random() * 200 < (Math.floor(agg / 700)) + 1) ene_dat[i][0] = 1;
                ene_dat[i][1] = Math.floor(Math.random() * (game.width - 60) + 30);
                ene_dat[i][2] = -50;
                ene_dat[i][4] = Math.floor(Math.random() * 10 + 1);
                ene_dat[i][5] = Math.floor(Math.random() * 5 + 9);
            }
            enemy[i].x = ene_dat[i][1];
            enemy[i].y = ene_dat[i][2];
            ene_dat[i][3] = ene_dat[i][3] + ene_dat[i][4];
        }
    }

    function hitEnemy(n) {
        for (var i = 0; i < 10; i++) {
            if ((Math.abs(ene_dat[n][1] - bul_dat[i][1]) < 16) && (Math.abs(ene_dat[n][2] - bul_dat[i][2]) < 30)) {
                bul_dat[i][0] = 0;
                score = score + 10 + (Math.floor(agg / 100));
                agg = agg + 9;
                s1++;
                sco.text = score;
                return 1;
            }
        }
        return 0;
    }

    function bangEnemy(n) {
        ene_dat[n][0] = 0;
        bang[n][0] = 1;
        bang[n][1] = ene_dat[n][1];
        bang[n][2] = ene_dat[n][2];
        bang[n][4] = 0;
        bang[n][3] = Math.floor(Math.random() * 4);
    }

    function doBang() {
        for (var i = 0; i < 10; i++) {
            if (bang[i][0] == 1) {
                if (bang[i][4] < 14) {
                    bang[i][4] = bang[i][4] + 1;
                } else {
                    bang[i][0] = 0;
                    bang[i][2] = -100;
                }

                bomb[i].x = bang[i][1] - 35;
                bomb[i].y = bang[i][2] - 25, bang_Pat[bang[i][3]] + (Math.floor(bang[i][4] / 2));
                bomb[i].frame = bang_Pat[bang[i][3]] + (Math.floor(bang[i][4] / 2));
                bomb[i].opacity = 255 - (Math.floor(bang[i][4] / 2)) * 30;
            }
        }
    }

    function attackRocket(n) {
        var i, xs, ys;
        for (i = 0; i < max_b; i++) {
            if (e_bullet[(i) % max_b][0] == 0) break;
        }

        if (((i != max_b) && (ene_dat[n][2] < 350)) && over == 0) {
            e_bullet[i][0] = 1;
            e_bullet[i][1] = ene_dat[n][1] + 15;
            e_bullet[i][2] = ene_dat[n][2] + 15;
            xs = e_bullet[i][1] - main_x - 32;
            ys = e_bullet[i][2] - main_y - 20;
            e_bullet[i][3] = Math.sin(Math.atan2(xs, ys));
            e_bullet[i][4] = Math.cos(Math.atan2(xs, ys));
            e_bullet[i][5] = Math.random() * (Math.floor(agg / 250)) + 1;
        }
    }

    function doAttack() {
        for (var i = 0; i < max_b; i++) {
            if (e_bullet[i][0] == 1) {
                e_bullet[i][1] -= e_bullet[i][3] * e_bullet[i][5];
                e_bullet[i][2] -= e_bullet[i][4] * e_bullet[i][5];
                enemy_bullet[i].x = e_bullet[i][1];
                enemy_bullet[i].y = e_bullet[i][2];
            }
            if (e_bullet[i][2] > game.height) e_bullet[i][0] = 0;

            if ((Math.abs(e_bullet[i][1] - main_x - 28) < 5) && (Math.abs(e_bullet[i][2] - main_y - 20) < 8)) gameover();
        }
    }

    function gameover() {
        over = 1;
        Gameover.y = 170;
        ene_dat[7][0] = 0;
        ene_dat[7][1] = main_x;
        ene_dat[7][2] = main_y;
        rocket.y = -100;
        bangEnemy(7);
    }

}
