window.onload = function() {
    // Code to integrate JS with HTML^^
    //MARK: Classes
    /**
     * @description A general container for room objects
     * @class Room
     * @param {string} name          A name to be displayed for debug/user interfacing purposes
     * @param {list} scene_data      A list of objects for each object to be displayed
     * @param {dict} action_point    A dict of action points and their bounding boxes
     * @param {Room} linked_overlay  A Room object to be displayed with the room
     */
    class Room {
        constructor(name = 'Room Object', scene_data = [{
                type: 'web_image',
                location: [50, 50],
                url: 'https://dl.dropboxusercontent.com/s/sjw076sykqily7k/not_found.png',
                set_size: [100, 100]
            }], action_points = {}, linked_overlay) {
                this.name = name;
                // the name of the room, for displaying to the user/debugging
                this.scene_data = scene_data;
                // scene_data holds the data for the room
                this.action_points = action_points;
                /* action_points is a dict with keys being lists of 4 coordinates as a bounding box where actions happen.
                The value is a callback function (that may change loaded_room to another room object). */
                if (linked_overlay != undefined) {
                    this.linked_overlay = linked_overlay;
                }
                // for linking room data to overlays to be displayed with the room
            }
            /**
             * @description  Displays the corresponding scene of the room; Removes all objects already on the room
             * @function display
             * @param {bool} overlay  If the room is being displayed as an overlay to something else
             */
        display(overlay = false) {
                if (!overlay) {
                    removeAll();
                }
                load_scene(this.scene_data);
            }
            /**
             * @description  Checks if a position hits an action point
             * @function update
             * @param {list[2]} pos  A position (usually of mouse) to check whether it hits action points or not
             */
        update = pos => {
            for (var action_bound in this.action_points) {
                if (check_bound(eval(action_bound), pos) == true) {
                    eval(this.action_points[action_bound]);
                }
            }
        };
    }

    //MARK: Game Setup
    //TODO: set up room objects for all rooms in game
    //TODO: Change the need for "LLevel = __level-name__";   LLevel.update();" in action points for rooms
    const start_room = new Room('start_room', [{
            type: 'web_image',
            location: [0, 0],
            url: 'http://dl.dropboxusercontent.com/s/2e7xzs8umr1ya6n/start_room.png'
        },
        {
            type: 'text',
            location: [135, 285],
            text: 'start',
        },
        {
            type: 'text',
            location: [110, 425],
            text: 'credits',
        }, {
            type: 'text',
            location: [37, 100],
            text: 'Escape the Room',
        }, {
            type: 'text',
            location: [270, 500],
            text: 'v0.0.02pre-alpha',
            font: '11pt Consolas'
        }
    ], {
        '[90,225,290,322]': 'if(USER_NAME==undefined){USER_NAME=prompt("What is your name?","User000")};LLevel.update(1,0);',
        '[100,365,270,440]': 'LLevel.update(2,0);'
    });
    const level_select = new Room('level_select', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/bx4vsrex31dn9tx/levels.png'
        },
        { type: 'text', location: [70, 65], text: 'Level select' },
        { type: 'text', location: [277, 475], text: 'back' },
        { type: 'text', location: [50, 140], text: 'L1' },
        { type: 'text', location: [177, 140], text: 'L2' },
        { type: 'text', location: [305, 140], text: 'L3' },
        { type: 'text', location: [50, 250], text: 'L4' },
        { type: 'text', location: [177, 250], text: 'L5' },
        { type: 'text', location: [305, 250], text: 'L6' },
        { type: 'text', location: [113, 357], text: 'L7' },
        { type: 'text', location: [240, 357], text: 'L8' }
    ], {
        '[31,85,125,167]': 'LLevel = Level1;  LLevel.update();',
        '[153,85,250,165]': 'LLevel = Level2;  LLevel.update();',
        '[282,85,375,164]': 'LLevel = Level3;  LLevel.update();',
        '[30,195,124,277]': 'LLevel = Level4;  LLevel.update();',
        '[152,200,250,280]': 'LLevel = Level5;  LLevel.update();',
        '[280,200,375,270]': 'LLevel = Level6;  LLevel.update();',
        '[90,300,185,380]': 'LLevel = Level7;  LLevel.update();',
        '[220,300,310,380]': 'LLevel = Level8; LLevel.update();',
        '[255,425,395,495]': 'LLevel.update();'
    }, new Room('level_overlay'));
    const credits = new Room('credits', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/zj92mm0ebqh727z/credits.png'
    }, {
        type: 'text',
        location: [270, 475],
        text: 'back'
    }], {
        '[255,425,400,500]': 'LLevel.update(0,0)'
    })
    const LevelStart = new Level('LStart', new Grid([1, 3], [
        [start_room, level_select, credits]
    ]), pos = [0, 0]);
    /* 
    template for rooms with only url
    new Room('__name__', [{
        type: 'web_image',
        location: [0,0],
        url: '__url__'
    }], {'[__coords__]':'__callback__'});
    */
    const L1e = new Room('Lv1_entrance', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/cn8tnhptljq2hsa/L1e.png'
        },
        { type: 'text', location: [0, 450], text: 'Click near the edges to ', font: '20pt Consolas' },
        { type: 'text', location: [0, 490], text: 'navigate through rooms!', font: '20pt Consolas' },
        { type: 'text', location: [0, 128], text: 'Open this door!', font: '20pt Consolas' }
    ], {
        '[0,0,50,500]': 'LLevel=LevelStart; LLevel.update();',
        '[350,0,400,500]': 'LLevel.update(1,0);'
    });
    const L1r = new Room('Lv1_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/ljoogcbp2hfwyx4/L1r_with-paper.png'
    }], {
        '[0,0,50,500]': 'LLevel.update(0,0);',
        '[350,385,400,450]': 'LLevel.update(1,1);',
        '[80,195,315,420]': 'LLevel.update(0,1);'
    });
    const L1r_paper_closeup = new Room('Lv1_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '3̶͊̆̓ͅ8̷͎̜̩̰̄̕4̶̨͈̜͈͌̔̕6̶͚̈́̄', font: '45pt Consolas' } //password for L1r safe
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);'
    });
    const L1r_safe_closeup = new Room('Lv1_safe-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);' //put this last so the update order gets to the numpad first
    });
    const Level1 = new Level('L1', new Grid([2, 2], [
        [L1e, L1r],
        [L1r_safe_closeup, L1r_paper_closeup]
    ]), pos = [0, 0]);
    const L2e = new Room('Lv2_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/c75b69cd74f41b1c690b981edd438771'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level2 = new Level('L2', new Grid([1, 1], [
        [L2e]
    ]), pos = [0, 0]);
    const L3e = new Room('Lv3_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/8a0ff0269c38c322e4dd54928a37e1e8'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level3 = new Level('L3', new Grid([1, 1], [
        [L3e]
    ]), pos = [0, 0]);
    const L4e = new Room('Lv4_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/3f668e244b2c250c27b96f41d8494c07'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level4 = new Level('L4', new Grid([1, 1], [
        [L4e]
    ]), pos = [0, 0]);
    const L5e = new Room('Lv5_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/423a283535121945fcdc926c85febd0e'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level5 = new Level('L5', new Grid([1, 1], [
        [L5e]
    ]), pos = [0, 0]);
    const L6e = new Room('Lv6_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/3ce76bc733da05177532fbd004dd250d'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level6 = new Level('L6', new Grid([1, 1], [
        [L6e]
    ]), pos = [0, 0]);
    const L7e = new Room('Lv7_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/fe193d750c155a8d367b45ee5537b916'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level7 = new Level('L7', new Grid([1, 1], [
        [L7e]
    ]), pos = [0, 0]);
    const L8e = new Room('Lv8_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/779ee02bf2672c86766750985b3db283'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level8 = new Level('L8', new Grid([1, 1], [
        [L8e]
    ]), pos = [0, 0]);
    LLevel = LevelStart;
    //MAIN LOOP
    LLevel.update()
    LLevel.loaded_room.display();
    mouseClickMethod(function(e) {
        // optional: add code that runs every time a click (not necessarily one to do something) happens
        LLevel.loaded_room.update([e.getX(), e.getY()]);
        LLevel.loaded_room.display();
        document.getElementById('current_doc').innerHTML = LLevel.loaded_room.name;
        changeHTML('text', LLevel.name);
        changeHTML('text2', LLevel.pos);
        changeHTML('username', USER_NAME);
    }); // Updates the loaded room on mouse click; displays loaded room if there is a different one being loaded
    mouseMoveMethod(function(e) {
        changeHTML('mouse_pos', `${e.getX()}, ${e.getY()}`); // displays mouse current pos in h3
    }); // mouse pos display; mainly for debug
    //HTML Integration
    if (typeof start === 'function') {
        start();
    }
};