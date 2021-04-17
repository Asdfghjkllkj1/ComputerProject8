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
                }], action_points = {}, local_data = {},
                on_update = function() {}, on_load = function() {}, linked_overlay) {
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
                this.local_data = local_data;
                // any room-related data
                this.on_update = on_update;
                // function to be called in update() function (maybe for reading from local_data)
                this.on_load = on_load;
                // function to be called when room gets loaded
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
            //this.on_update();
            for (var action_bound in this.action_points) {
                if (check_bound(eval(action_bound), pos) == true) {
                    eval(this.action_points[action_bound]);
                    break;
                }
            }
            this.on_update(); //Depends on update order whether action_points or on_update should come first
        };
    }
    //TODO: set up room objects for all rooms in game
    //TODO: Change the need for "LLevel = __level-name__";   LLevel.update();" in action points for rooms
    const blank_room = new Room('blank_room', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/sjw076sykqily7k/not_found.png',
        set_size: [0, 0]
    }]);
    //MARK: Start Room stuff
    const start_room = new Room('start_room', [{
            type: 'web_image',
            location: [0, 0],
            url: 'http://dl.dropboxusercontent.com/s/2e7xzs8umr1ya6n/start_room.png'
        },
        { type: 'text', location: [135, 285], text: 'start', },
        { type: 'text', location: [110, 425], text: 'credits', },
        { type: 'text', location: [37, 100], text: 'Escape the Room', },
        { type: 'text', location: [270, 500], text: 'v0.0.04pre-alpha', font: '11pt Consolas' }
    ], {
        '[90,225,290,322]': 'if(USER_NAME==undefined){USER_NAME=prompt("What is your name?","User000")};LLevel.update(0,1);',
        '[100,365,270,440]': 'LLevel.update(0,2);'
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
        },
        { type: 'text', location: [270, 475], text: 'back' },
        { type: 'text', location: [20, 50], text: 'Made by: *AUTHOR_NAME*', font: '20pt Consolas' },
        { type: 'text', location: [20, 110], text: 'Artwork: *ARTIST_NAME*', font: '20pt Consolas' }
    ], {
        '[255,425,400,500]': 'LLevel.update()'
    })
    const LevelStart = new Level('LStart', new Grid([1, 3], [
        [start_room, level_select, credits]
    ]), pos = [0, 0]);
    //MARK: Level 1 stuff
    const L1e = new Room('Lv1_entrance', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/cn8tnhptljq2hsa/L1e.png'
        },
        { type: 'text', location: [0, 450], text: 'Click near the edges to ', font: '20pt Consolas' },
        { type: 'text', location: [0, 490], text: 'navigate through rooms!', font: '20pt Consolas' },
        { type: 'text', location: [0, 128], text: 'Open this door!', font: '20pt Consolas' }
    ], {
        '[350,0,400,500]': 'LLevel.update(0,1);LLevel.loaded_room.display();',
        '[50,155,240,400]': 'if (LLevel.fetch_data("completed")==true){LLevel=LevelStart;LLevel.update(0,1);}'
    }, {}, function() {}, function() {
        if (LLevel.fetch_data('completed') == true) {
            this.linked_overlay = L1e_open_door;
            LLevel.loaded_room.scene_data = [
                { type: "web_image", url: "https://dl.dropboxusercontent.com/s/cn8tnhptljq2hsa/L1e.png" },
                { type: "text", location: [0, 128], text: "Opened!", font: "20pt Consolas" }
            ];
        }
    });
    const L1e_open_door = new Room('Lv1_open-door', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/3tru67sxyzv1eii/L1e_overlay--open_door--cropped.png',
        location: [45, 150],
        set_size: [200, 300]
    }]);
    const L1r = new Room('Lv1_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/ljoogcbp2hfwyx4/L1r_with-paper.png'
    }], {
        '[0,0,50,500]': 'LLevel.update(0,0);', // nav back to L1e
        '[350,385,400,450]': 'LLevel.update(1,1);', // paper slip
        '[80,195,315,420]': 'if(LLevel.fetch_data("open_safe")==true){LLevel.update(1,2);}else{LLevel.update(1,0);}' //to safe
    });
    const L1r_paper_closeup = new Room('Lv1_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '3̶͊̆̓ͅ8̷͎̜̩̰̄̕4̶̨͈̜͈͌̔̕6̶͚̈́̄', font: '45pt Consolas' } //password for L1r safe
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1);'
    });
    const L1r_safe_inside = new Room('Lv1_safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png',
    }], {
        '[210,270,359,343]': 'if(LLevel.fetch_data("completed")==false){LLevel.loaded_room.linked_overlay=null;LLevel.push_data("completed", true);}',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1)'
    }, {}, function() {}, function() {}, new Room('Lv1_safe-key', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png',
        location: [210, 270],
        set_size: [149, 73]
    }]))
    const L1r_safe_open = new Room('Lv1_safe-open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/l441qr7jhtls9it/L1r_overlay--open_safe--cropped.png',
        location: [0, 104],
        set_size: [360, 365]
    }]);
    const L1r_safe_closeup = new Room('Lv1_safe-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
        },
        { type: 'text', location: [88, 215], text: '1   2   3' },
        { type: 'text', location: [88, 260], text: '4   5   6' },
        { type: 'text', location: [88, 303], text: '7   8   9' },
        { type: 'text', location: [174, 350], text: '0' }
    ], {
        '[70,175,132,222]': 'this.local_data["cur_pass"].push(1);', //1
        '[132,175,225,222]': 'this.local_data["cur_pass"].push(2);', //2
        '[225,175,300,222]': 'this.local_data["cur_pass"].push(3);', //3
        '[70,222,132,270]': 'this.local_data["cur_pass"].push(4);', //4
        '[132,222,225,270]': 'this.local_data["cur_pass"].push(5);', //5
        '[225,222,300,270]': 'this.local_data["cur_pass"].push(6);', //6
        '[70,270,132,310]': 'this.local_data["cur_pass"].push(7);', //7
        '[132,270,225,310]': 'this.local_data["cur_pass"].push(8);', //8
        '[225,270,300,310]': 'this.local_data["cur_pass"].push(9);', //9
        '[132,310,225,363]': 'this.local_data["cur_pass"].push(0);', //0
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1);' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [3, 8, 4, 6], cur_pass: [] }, on_update = function() {
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [];
                LLevel.push_data('open_safe', true);
                LLevel.update(0, 1);
                LLevel.loaded_room.linked_overlay = L1r_safe_open;
            } else { this.local_data['cur_pass'] = []; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const Level1 = new Level('L1', new Grid([2, 3], [
        [L1e, L1r, null],
        [L1r_safe_closeup, L1r_paper_closeup, L1r_safe_inside]
    ]), pos = [0, 0], user_data = { completed: false, open_safe: false });
    //MARK: Level 2 stuff
    const L2e = new Room('Lv2_entrance', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/a3hns7bajccqozx/L2e.png'
    }], {
        '[350,0,400,500]': 'LLevel.update(0,1);',
        '[240,210,390,310]': 'LLevel.update(1,0);',
        '[0,0,50,HEIGHT]': 'LLevel.update(0,2);',
        '[40,160,225,400]': 'if(LLevel.fetch_data("door_keycode")&&LLevel.fetch_data("has_key")){LLevel=LevelStart; Level.update(0,1);}'
    }, {}, function() {}, function() {
        if (LLevel.fetch_data("door_keycode") && LLevel.fetch_data("has_key")) {
            this.linked_overlay = L2e_open_door;
            LLevel.loaded_room.scene_data = [
                { type: 'web_image', url: 'https://dl.dropboxusercontent.com/s/a3hns7bajccqozx/L2e.png' },
                { type: "text", location: [0, 128], text: "Opened!", font: "20pt Consolas" }
            ];
        }
    });
    const L2r = new Room('Lv2_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/37ofy89jpcayi40/L2r.png'
    }], {
        '[0,0,50,HEIGHT]': 'LLevel.update();LLevel.loaded_room.display();',
        '[85,300,200,340]': 'this.local_data["left_cush"]=true;',
        '[200,300,310,340]': 'this.local_data["right_cush"]=true;if(LLevel.fetch_data("has_key")==false){LLevel.loaded_room.linked_overlay.scene_data.push({type: "web_image", url: "https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png", location: [205,400], set_size: [110,100]});}LLevel.push_data("has_key", true);',
        '[205,400,315,500]': 'LLevel.loaded_room.linked_overlay.scene_data=[];'
    }, local_data = { left_cush: false, right_cush: false }, function __check_cushions() {
        if (this.local_data['left_cush'] == true && this.local_data['right_cush'] == true) {
            LLevel.loaded_room.linked_overlay.scene_data.push({
                type: 'web_image',
                url: 'https://dl.dropboxusercontent.com/s/0ccbtoafaken0cw/L2r_both-cushions--clipped_overlay.png',
                location: [0, 195],
                set_size: [400, 226]
            });
        } else if (this.local_data['left_cush'] == true) {
            LLevel.loaded_room.linked_overlay.scene_data.push({
                type: 'web_image',
                url: 'https://dl.dropboxusercontent.com/s/p4guunn9rbzz9ri/L2r_left-cushion--clipped_overlay.png',
                location: [0, 194],
                set_size: [398, 202]
            });
        } else if (this.local_data['right_cush'] == true) {
            LLevel.loaded_room.linked_overlay.scene_data.push({
                type: 'web_image',
                url: 'https://dl.dropboxusercontent.com/s/qr6sz7akwtvyzcx/L2r_right-cushion--clipped_overlay.png',
                location: [0, 194],
                set_size: [400, 203]
            });
        } else {
            LLevel.loaded_room.linked_overlay.scene_data = [{}];
        }
    }, function() {
        __check_cushions();
    }, new Room('L2r_overlay', []));
    const L2l = new Room('Lv2_left', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/8m5xft1d6a10gjr/L2l.png'
    }], {
        '[80,195,315,420]': 'if(LLevel.fetch_data("open_safe")==true){LLevel.update(1,2);}else{LLevel.update(1,1);}',
        '[350,0,400,500]': 'LLevel.update();//LLevel.loaded_room.display();'
    });
    const L2e_open_door = new Room('Lv2_open-door', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/3tru67sxyzv1eii/L1e_overlay--open_door--cropped.png',
        location: [30, 153],
        set_size: [200, 300]
    }]);
    const L2r_safe_open = new Room('Lv2_safe-open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/l441qr7jhtls9it/L1r_overlay--open_safe--cropped.png',
        location: [0, 104],
        set_size: [360, 365]
    }]);
    const L2l_safe_closeup = new Room('Lv2_safe-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
        },
        { type: 'text', location: [88, 215], text: '1   2   3' },
        { type: 'text', location: [88, 260], text: '4   5   6' },
        { type: 'text', location: [88, 303], text: '7   8   9' },
        { type: 'text', location: [174, 350], text: '0' }
    ], {
        '[70,175,132,222]': 'this.local_data["cur_pass"].push(1);', //1
        '[132,175,225,222]': 'this.local_data["cur_pass"].push(2);', //2
        '[225,175,300,222]': 'this.local_data["cur_pass"].push(3);', //3
        '[70,222,132,270]': 'this.local_data["cur_pass"].push(4);', //4
        '[132,222,225,270]': 'this.local_data["cur_pass"].push(5);', //5
        '[225,222,300,270]': 'this.local_data["cur_pass"].push(6);', //6
        '[70,270,132,310]': 'this.local_data["cur_pass"].push(7);', //7
        '[132,270,225,310]': 'this.local_data["cur_pass"].push(8);', //8
        '[225,270,300,310]': 'this.local_data["cur_pass"].push(9);', //9
        '[132,310,225,363]': 'this.local_data["cur_pass"].push(0);', //0
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1);' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [7, 3, 4], cur_pass: [] }, on_update = function() {
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [];
                LLevel.push_data('open_safe', true);
                LLevel.update(0, 2);
                LLevel.loaded_room.linked_overlay = L2r_safe_open;
            } else { this.local_data['cur_pass'] = []; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const L2l_safe_inside = new Room('Lv2_safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png',
    }], {
        '[160,320,309,393]': 'LLevel.update(1,3);',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1)'
    }, {}, function() {}, function() {}, new Room('Lv2_safe-paper', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/cxaemedms4x906q/paper_slip--far_cropped.png',
        location: [160, 320],
        set_size: [149, 73]
    }]));
    const L2l_paper_closeup = new Room('Lv2_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '5̴̡̙̹̓͋̇̿͜9̸̧̜́̏̀͝3̵̢̭̜̅̋͠', font: '45pt Consolas' }
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,2);'
    });
    const L2e_combo_closeup = new Room('Lv2_combo-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/2x8khq5cn4xztnt/3-number_combo_lock--closeup_overlay.png'
    }], {
        '[70,200,120,300]': 'this.local_data["cur_pass"][0]=parseInt(prompt("Enter number for slot 1: "));',
        '[170,200,230,300]': 'this.local_data["cur_pass"][1]=parseInt(prompt("Enter number for slot 2: "));',
        '[300,200,340,300]': 'this.local_data["cur_pass"][2]=parseInt(prompt("Enter number for slot 3: "));',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update();'
    }, local_data = { correct_pass: [5, 9, 3], cur_pass: [null, null, null] }, on_update = function() {
        if (all_same_type(this.local_data['cur_pass'].concat(this.local_data['correct_pass']))) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [null, null, null];
                LLevel.push_data('door_keycode', true);
                LLevel.update();
            } else { this.local_data['cur_pass'] = [null, null, null]; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const Level2 = new Level('L2', new Grid([2, 4], [
        [L2e, L2r, L2l, undefined],
        [L2e_combo_closeup, L2l_safe_closeup, L2l_safe_inside, L2l_paper_closeup]
    ]), pos = [0, 0], { open_safe: false, door_keycode: false, has_key: false });
    //MARK: Level 3 stuff
    const L3e = new Room('Lv3_entrance', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/o1h61u928qzzpzl/L3e.png'
    }], {
        '[350,0,WIDTH,HEIGHT]': 'if(LLevel.fetch_data("wood_door_open")==false){LLevel.update(0,2);}else{LLevel.update(1,2);}',
        '[0,0,50,HEIGHT]': 'LLevel.update(0,1);',
        '[250,100,395,275]': 'if(LLevel.fetch_data("l3e_safe")==false){LLevel.update(2,2);}else{LLevel.update(2,0);}',
        '[250,345,370,400]': 'LLevel.update(4,0);',
        '[25,35,235,120]': 'LLevel.update(3,0);',
        '[30,160,230,400]': 'if(LLevel.fetch_data("has_key")==true&&LLevel.fetch_data("door_keycode")==true){LLevel=LevelStart;LLevel.update(0,1);}'
    }, {}, function() {}, function() {
        if (LLevel.fetch_data("door_keycode") == true && LLevel.fetch_data("has_key") == true) {
            this.linked_overlay = L3e_open_door;
            LLevel.loaded_room.scene_data = [
                { type: 'web_image', url: 'https://dl.dropboxusercontent.com/s/o1h61u928qzzpzl/L3e.png' },
                { type: "text", location: [30, 470], text: "Opened!", font: "20pt Consolas" }
            ];
        }
    });
    const L3e_open_door = new Room('Lv3_open-door', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/3tru67sxyzv1eii/L1e_overlay--open_door--cropped.png',
        location: [30, 153],
        set_size: [200, 300]
    }]);
    const L3l = new Room('Lv3_left', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/qgsu3nqibof8v6h/L3l.png'
    }], {
        '[75,195,315,420]': 'if(LLevel.fetch_data("l3l_safe")==false){LLevel.update(3,2);}else{LLevel.update(3,1);}',
        '[350,0,WIDTH,HEIGHT]': 'LLevel.update();'
    });
    const L3r = new Room('Lv3_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/vfkgm2u51yypcjx/L3r.png'
    }], {
        '[35,10,150,110]': 'LLevel.update(1,1);',
        '[0,0,50,HEIGHT]': 'LLevel.update();'
    });
    const L3e_paper_closeup = new Room('Lv3entrance_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '5̶͚̘̂̓9̵̡̤͐̍4̸̥̰̊̈́9̵͔̄', font: '45pt Consolas' }
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update();'
    });
    const L3r_paper_closeup = new Room('Lv3right_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '3̴̫̫̩͙̙̊̂7̶̔̈ͅ6̷̛̰͌9̶͇̻͉̍̚͘͝', font: '45pt Consolas' }
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);'
    });
    const L3e_safe_paper_closeup = new Room('Lv3entrance-safe_paper-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
        },
        { type: 'text', location: [135, 250], text: '1̶̛̥̑̔̍̕8̸̡̖̣͕̓̀̕3̴̞̬̚7̵̰̮̀̏͘', font: '45pt Consolas' }
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update();'
    });
    const L3r_open = new Room('Lv3_right--open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/8wnzlki7s46zogl/L3r_open-door.png'
    }], {
        '[125,295,300,450]': 'if(LLevel.fetch_data("l3r_safe")==false){LLevel.update(2,1);}else{LLevel.update(1,0);}',
        '[0,0,50,HEIGHT]': 'LLevel.update();'
    });
    const L3r_motor_closeup = new Room('Lv3_motor-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/q1sv4shau7d8v7j/L3r_motor-closeup.png'
    }], {
        '[25,130,370,390]': 'if(LLevel.fetch_data("has_battery")==true){LLevel.push_data("wood_door_open", true);LLevel.update(1,2);}else{alert("The motor doesn\'t have batteries!");}',
        '[0,0,WIDTH,HEIGHT]': 'if(LLevel.fetch_data("wood_door_open")==false){LLevel.update(0,2);}else{LLevel.update(1,2);}'
    });
    const L3e_combo_closeup = new Room('Lv3_combo-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/8dcppakp0b5wozh/4-number_combo_lock--closeup_overlay.png'
    }], {
        '[25,210,90,320]': 'this.local_data["cur_pass"][0]=parseInt(prompt("Enter number for slot 1: "));',
        '[120,210,190,320]': 'this.local_data["cur_pass"][1]=parseInt(prompt("Enter number for slot 2: "));',
        '[220,210,290,320]': 'this.local_data["cur_pass"][2]=parseInt(prompt("Enter number for slot 3: "));',
        '[320,210,370,320]': 'this.local_data["cur_pass"][3]=parseInt(prompt("Enter number for slot 4: "));',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update()'
    }, local_data = { correct_pass: [3, 7, 6, 9], cur_pass: [null, null, null, null] }, on_update = function() {
        if (all_same_type(this.local_data['cur_pass'].concat(this.local_data['correct_pass']))) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [null, null, null, null];
                LLevel.push_data('door_keycode', true);
                LLevel.update();
            } else { this.local_data['cur_pass'] = [null, null, null, null]; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    })
    const L3r_safe_inside = new Room('Lv3right_safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png'
    }, {
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/cxaemedms4x906q/paper_slip--far_cropped.png',
        location: [68, 290],
        set_size: [110, 50]
    }], {
        '[68,290,178,340]': 'LLevel.update(4,1);',
        '[170,270,319,343]': 'if(LLevel.fetch_data("has_key")==false){LLevel.push_data("has_key",true);LLevel.loaded_room.linked_overlay=null;}',
        '[0,0,WIDTH,HEIGHT]': 'if(LLevel.fetch_data("wood_door_open")==false){LLevel.update(0,2);}else{LLevel.update(1,2);}'
    }, {}, function() {}, function() {}, new Room('Lv3right_key', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png',
        location: [170, 270],
        set_size: [149, 73]
    }]));
    const L3r_safe_closeup = new Room('Lv3right_safe-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
        },
        { type: 'text', location: [88, 215], text: '1   2   3' },
        { type: 'text', location: [88, 260], text: '4   5   6' },
        { type: 'text', location: [88, 303], text: '7   8   9' },
        { type: 'text', location: [174, 350], text: '0' }
    ], {
        '[70,175,132,222]': 'this.local_data["cur_pass"].push(1);', //1
        '[132,175,225,222]': 'this.local_data["cur_pass"].push(2);', //2
        '[225,175,300,222]': 'this.local_data["cur_pass"].push(3);', //3
        '[70,222,132,270]': 'this.local_data["cur_pass"].push(4);', //4
        '[132,222,225,270]': 'this.local_data["cur_pass"].push(5);', //5
        '[225,222,300,270]': 'this.local_data["cur_pass"].push(6);', //6
        '[70,270,132,310]': 'this.local_data["cur_pass"].push(7);', //7
        '[132,270,225,310]': 'this.local_data["cur_pass"].push(8);', //8
        '[225,270,300,310]': 'this.local_data["cur_pass"].push(9);', //9
        '[132,310,225,363]': 'this.local_data["cur_pass"].push(0);', //0
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,2);' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [1, 8, 3, 7], cur_pass: [] }, on_update = function() {
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [];
                LLevel.push_data('l3r_safe', true);
                LLevel.update(1, 2);
                LLevel.loaded_room.linked_overlay = L3r_safe_open;
            } else { this.local_data['cur_pass'] = []; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const L3r_safe_open = new Room('Lv3right_safe-open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/l441qr7jhtls9it/L1r_overlay--open_safe--cropped.png',
        location: [72, 228],
        set_size: [253, 270]
    }]);
    const L3e_safe_inside = new Room('Lv3entrance_safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png',
        location: [0, -50],
        set_size: [WIDTH, HEIGHT + 50]
    }, {
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/cxaemedms4x906q/paper_slip--far_cropped.png',
        location: [68, 290],
        set_size: [110, 50]
    }], {
        '[75,292,177,335]': 'LLevel.update(4,2);',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update();'
    });
    const L3e_safe_closeup = new Room('Lv3entrance_safe-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
        },
        { type: 'text', location: [88, 215], text: '1   2   3' },
        { type: 'text', location: [88, 260], text: '4   5   6' },
        { type: 'text', location: [88, 303], text: '7   8   9' },
        { type: 'text', location: [174, 350], text: '0' }
    ], {
        '[70,175,132,222]': 'this.local_data["cur_pass"].push(1);', //1
        '[132,175,225,222]': 'this.local_data["cur_pass"].push(2);', //2
        '[225,175,300,222]': 'this.local_data["cur_pass"].push(3);', //3
        '[70,222,132,270]': 'this.local_data["cur_pass"].push(4);', //4
        '[132,222,225,270]': 'this.local_data["cur_pass"].push(5);', //5
        '[225,222,300,270]': 'this.local_data["cur_pass"].push(6);', //6
        '[70,270,132,310]': 'this.local_data["cur_pass"].push(7);', //7
        '[132,270,225,310]': 'this.local_data["cur_pass"].push(8);', //8
        '[225,270,300,310]': 'this.local_data["cur_pass"].push(9);', //9
        '[132,310,225,363]': 'this.local_data["cur_pass"].push(0);', //0
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update();' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [1, 0, 3, 7], cur_pass: [] }, on_update = function() {
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [];
                LLevel.push_data('l3e_safe', true);
                LLevel.update();
                LLevel.loaded_room.linked_overlay = L3e_safe_open;
            } else { this.local_data['cur_pass'] = []; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const L3e_safe_open = new Room('Lv3entrance_safe-open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/uzu56r5p0tjpqwh/wall_safe--open.png',
        location: [245, 92],
        set_size: [155, 228]
    }]);
    const L3l_safe_inside = new Room('Lv3left_safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png'
    }], {
        '[150,225,250,345]': 'if(LLevel.fetch_data("has_battery")==false){LLevel.push_data("has_battery",true);LLevel.loaded_room.linked_overlay=null;}',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1);'
    }, {}, function() {}, function() {}, new Room('Lv3_batteries', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/vwdpkljkfntgyc3/battery_pack.png',
        location: [150, 225],
        set_size: [100, 120]
    }]));
    const L3l_safe_closeup = new Room('Lv3left_safe-closeup', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/v77z2m0y5fu7bts/closed_safe--closeup.png'
        },
        { type: 'text', location: [88, 215], text: '1   2   3' },
        { type: 'text', location: [88, 260], text: '4   5   6' },
        { type: 'text', location: [88, 303], text: '7   8   9' },
        { type: 'text', location: [174, 350], text: '0' }
    ], {
        '[70,175,132,222]': 'this.local_data["cur_pass"].push(1);', //1
        '[132,175,225,222]': 'this.local_data["cur_pass"].push(2);', //2
        '[225,175,300,222]': 'this.local_data["cur_pass"].push(3);', //3
        '[70,222,132,270]': 'this.local_data["cur_pass"].push(4);', //4
        '[132,222,225,270]': 'this.local_data["cur_pass"].push(5);', //5
        '[225,222,300,270]': 'this.local_data["cur_pass"].push(6);', //6
        '[70,270,132,310]': 'this.local_data["cur_pass"].push(7);', //7
        '[132,270,225,310]': 'this.local_data["cur_pass"].push(8);', //8
        '[225,270,300,310]': 'this.local_data["cur_pass"].push(9);', //9
        '[132,310,225,363]': 'this.local_data["cur_pass"].push(0);', //0
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,1);' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [5, 9, 4, 9], cur_pass: [] }, on_update = function() {
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = [];
                LLevel.push_data('l3l_safe', true);
                LLevel.update(0, 1);
                LLevel.loaded_room.linked_overlay = L3l_safe_open;
            } else { this.local_data['cur_pass'] = []; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const L3l_safe_open = new Room('Lv3left_safe-open', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/l441qr7jhtls9it/L1r_overlay--open_safe--cropped.png',
        location: [0, 104],
        set_size: [360, 365]
    }]);
    const Level3 = new Level('L3', new Grid([5, 3], [
        [L3e, L3l, L3r],
        [L3r_safe_inside, L3r_motor_closeup, L3r_open],
        [L3e_safe_inside, L3r_safe_closeup, L3e_safe_closeup],
        [L3e_combo_closeup, L3l_safe_inside, L3l_safe_closeup],
        [L3e_paper_closeup, L3r_paper_closeup, L3e_safe_paper_closeup]
    ]), pos = [0, 0], { wood_door_open: false, door_keycode: false, has_key: false, has_battery: false, l3r_safe: false, l3e_safe: false, l3l_safe: false });
    //MARK: Level 4 stuff
    const L4e = new Room('Lv4_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/3f668e244b2c250c27b96f41d8494c07'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level4 = new Level('L4', new Grid([1, 1], [
        [L4e]
    ]), pos = [0, 0]);
    //MARK: Level 5 stuff
    const L5e = new Room('Lv5_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/423a283535121945fcdc926c85febd0e'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level5 = new Level('L5', new Grid([1, 1], [
        [L5e]
    ]), pos = [0, 0]);
    //MARK: Level 6 stuff
    const L6e = new Room('Lv6_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/3ce76bc733da05177532fbd004dd250d'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level6 = new Level('L6', new Grid([1, 1], [
        [L6e]
    ]), pos = [0, 0]);
    //MARK: Level 7 stuff
    const L7e = new Room('Lv7_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/fe193d750c155a8d367b45ee5537b916'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level7 = new Level('L7', new Grid([1, 1], [
        [L7e]
    ]), pos = [0, 0]);
    //MARK: Level 8 stuff
    const L8e = new Room('Lv8_entrance', [{
        type: 'web_image',
        url: 'https://codehs.com/uploads/779ee02bf2672c86766750985b3db283'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel=LevelStart; LLevel.update();'
    });
    const Level8 = new Level('L8', new Grid([1, 1], [
        [L8e]
    ]), pos = [0, 0]);
    LLevel = LevelStart;
    //MAIN LOOP
    LLevel.update()
    LLevel.loaded_room.display();
    if (LLevel.loaded_room.linked_overlay != undefined) {
        LLevel.loaded_room.linked_overlay.display(overlay = true);
    }
    mouseClickMethod(function(e) {
        // optional: add code that runs every time a click (not necessarily one to do something) happens
        LLevel.loaded_room.update([e.getX(), e.getY()]);
        LLevel.loaded_room.display();
        if (LLevel.loaded_room.linked_overlay != undefined) {
            LLevel.loaded_room.linked_overlay.display(overlay = true);
        }
        document.getElementById('current_doc').innerHTML = LLevel.loaded_room.name;
        changeHTML('text', LLevel.name);
        changeHTML('text2', LLevel.pos);
    }); // Updates the loaded room on mouse click; displays loaded room if there is a different one being loaded
    mouseMoveMethod(function(e) {
        changeHTML('mouse_pos', `${e.getX()}, ${e.getY()}`); // displays mouse current pos in h3
    }); // mouse pos display; mainly for debug
    //HTML Integration
    if (typeof start === 'function') {
        start();
    }
};