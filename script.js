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
    //MARK: Start Room stuff
    const start_room = new Room('start_room', [{
            type: 'web_image',
            location: [0, 0],
            url: 'http://dl.dropboxusercontent.com/s/2e7xzs8umr1ya6n/start_room.png'
        },
        { type: 'text', location: [135, 285], text: 'start', },
        { type: 'text', location: [110, 425], text: 'credits', },
        { type: 'text', location: [37, 100], text: 'Escape the Room', },
        { type: 'text', location: [250, 120], text: 'v0.1.02beta-public', font: '11pt Consolas' }
    ], {
        '[90,225,290,322]': 'if(USER_NAME==undefined){USER_NAME=prompt("What is your name?","User000")};LLevel.update(0,1);',
        '[100,365,270,440]': 'LLevel.update(0,2);'
    });
    const level_select = new Room('level_select', [{
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/fdpjanpndyvp5cc/levels%284%29.png'
        },
        { type: 'text', location: [70, 65], text: 'Level select' },
        { type: 'text', location: [277, 475], text: 'back' },
        { type: 'text', location: [50, 175], text: 'L1' },
        { type: 'text', location: [300, 175], text: 'L2' },
        { type: 'text', location: [50, 290], text: 'L3' },
        { type: 'text', location: [300, 290], text: 'L4' }
    ], {
        '[30,125,120,200]': 'LLevel = Level1;  LLevel.update();',
        '[280,120,370,200]': 'LLevel = Level2;  LLevel.update();',
        '[30,230,120,310]': 'LLevel = Level3;  LLevel.update();',
        '[285,235,370,312]': 'LLevel = Level5;  LLevel.update();',
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
        url: 'https://dl.dropboxusercontent.com/s/m8q3p8rjgi90iiz/key_exit.png',
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
    }, local_data = { correct_pass: [3, 8, 4, 6], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('open_safe', true);
                LLevel.update(0, 1);
                LLevel.loaded_room.linked_overlay = L1r_safe_open;
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
        '[40,160,225,400]': 'if(LLevel.fetch_data("door_keycode")==true&&LLevel.fetch_data("has_key")==true){LLevel=LevelStart; Level.update(0,1);LLevel.loaded_room.display();}'
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
    }, {}], {
        '[0,0,50,HEIGHT]': 'LLevel.update();LLevel.loaded_room.display();',
        '[85,300,200,340]': 'this.local_data["left_cush"]=true;',
        '[200,300,310,340]': 'this.local_data["right_cush"]=true;if(LLevel.fetch_data("has_key")==false){this.scene_data.push({ type: "web_image", url: "https://dl.dropboxusercontent.com/s/m8q3p8rjgi90iiz/key_exit.png", location: [205, 400], set_size: [110, 100] });}',
        '[205,400,315,500]': 'if(this.local_data["right_cush"]==true&&LLevel.fetch_data("has_key")==false){LLevel.push_data("has_key", true);this.scene_data.pop();}'
    }, local_data = { left_cush: false, right_cush: false }, function __check_cushions() {
        var __both_cushions = {
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/0ccbtoafaken0cw/L2r_both-cushions--clipped_overlay.png',
            location: [0, 195],
            set_size: [400, 226]
        };
        var __left_cushion = {
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/p4guunn9rbzz9ri/L2r_left-cushion--clipped_overlay.png',
            location: [0, 194],
            set_size: [398, 202]
        };
        var __right_cushion = {
            type: 'web_image',
            url: 'https://dl.dropboxusercontent.com/s/qr6sz7akwtvyzcx/L2r_right-cushion--clipped_overlay.png',
            location: [0, 194],
            set_size: [400, 203]
        };
        var __key = { type: "web_image", url: "https://dl.dropboxusercontent.com/s/m8q3p8rjgi90iiz/key_exit.png", location: [205, 400], set_size: [110, 100] }
        if (this.local_data['left_cush'] == true && this.local_data['right_cush'] == true) {
            this.linked_overlay = new Room('L2r_overlay_both-cushions', [__both_cushions]);
        } else if (this.local_data['left_cush'] == true) {
            this.linked_overlay = new Room('L2r_overlay_left-cushion', [__left_cushion]);
        } else if (this.local_data['right_cush'] == true) {
            this.linked_overlay = new Room('L2r_overlay_right-cushion', [__right_cushion]);
        }
    }, function() {
        __check_cushions();
    }, new Room('L2r_overlay', [{}]));
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
    }, local_data = { correct_pass: [7, 3, 4], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('open_safe', true);
                LLevel.update(0, 2);
                LLevel.loaded_room.linked_overlay = L2r_safe_open;
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
    }, local_data = { correct_pass: [5, 9, 3], cur_pass: [null, null, null], blank_pass: [null, null, null] }, on_update = function() {
        this.local_data['blank_pass'] = [null, null, null];
        if (all_same_type(this.local_data['cur_pass'].concat(this.local_data['correct_pass']))) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('door_keycode', true);
                LLevel.update();
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
    }, local_data = { correct_pass: [3, 7, 6, 9], cur_pass: [null, null, null, null], blank_pass: [null, null, null, null] }, on_update = function() {
        this.local_data['blank_pass'] = [null, null, null, null];
        if (all_same_type(this.local_data['cur_pass'].concat(this.local_data['correct_pass']))) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('door_keycode', true);
                LLevel.update();
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
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
        url: 'https://dl.dropboxusercontent.com/s/m8q3p8rjgi90iiz/key_exit.png',
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
    }, local_data = { correct_pass: [1, 8, 3, 7], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('l3r_safe', true);
                LLevel.update(1, 2);
                LLevel.loaded_room.linked_overlay = L3r_safe_open;
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
    }, local_data = { correct_pass: [1, 0, 3, 7], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('l3e_safe', true);
                LLevel.update();
                LLevel.loaded_room.linked_overlay = L3e_safe_open;
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
    }, local_data = { correct_pass: [5, 9, 4, 9], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('l3l_safe', true);
                LLevel.update(0, 1);
                LLevel.loaded_room.linked_overlay = L3l_safe_open;
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
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
    //MARK: Level 4 stuff (Lv4 in public branch is Lv5 data)
    //MARK: Level 5 stuff
    const L5e = new Room('Lv5_entrance', [{ //FOR DOOR: MUST USE UNSHIFT INSTEAD OF PUSH BECAUSE OF KEY CLICK DETECTION
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/cn4fk2lyx4b46e5/L5e.png'
    }], {
        '[350,0,WIDTH,HEIGHT]': 'if(LLevel.fetch_data("bulletin")==true){LLevel.update(0,1);}else{LLevel.update(2,0);}',
        '[100,55,250,125]': 'if(this.local_data["open_sign"]==true&&LLevel.fetch_data("has_bulletin_key")==false){LLevel.loaded_room.linked_overlay.scene_data.pop();LLevel.push_data("has_bulletin_key", true);}', //HERE IS WHY UNSHIFT MUST BE USED
        '[40,20,320,130]': 'LLevel.loaded_room.linked_overlay.scene_data.push({type: "web_image",url: "https://dl.dropboxusercontent.com/s/r1olz0k9t9uxizx/L5e_overlay--open_sign.png",set_size: [400, 144]});this.local_data["open_sign"]=true;if(LLevel.fetch_data("has_bulletin_key")==false){LLevel.loaded_room.linked_overlay.scene_data.push({type: "web_image", url: "https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png", location: [100,55], set_size: [150,70]})}',
        '[30,153,230,454]': 'if(LLevel.fetch_data("has_key")==true){LLevel = LevelStart;LLevel.update(0,1);}' //L4 completed = true for public
    }, { open_sign: false }, function() {}, function() {
        if (LLevel.fetch_data('has_key') == true) {
            LLevel.loaded_room.linked_overlay.scene_data.push({
                type: 'web_image',
                url: 'https://dl.dropboxusercontent.com/s/3tru67sxyzv1eii/L1e_overlay--open_door--cropped.png',
                location: [30, 153],
                set_size: [200, 301]
            });
            LLevel.loaded_room.scene_data.push({ type: "text", location: [30, 480], text: "Opened!", font: "20pt Consolas" });
        }
    }, new Room('Lv5_entrance-overlay', [{}]));
    const L5r = new Room('Lv5_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/kpaja16aqpm4jnw/L5r.png'
    }], {
        '[0,0,50,HEIGHT]': 'LLevel.update();',
        '[350,0,WIDTH,HEIGHT]': 'LLevel.update(0,2);',
        '[175,230,215,275]': 'if(LLevel.fetch_data("has_bulletin_key")==true){LLevel.update(2,0);LLevel.push_data("bulletin", false);}'
    });
    const L5r_open = new Room('Lv5_right--no-bulletin', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/wkmcd4f4al674re/L5r_no-bulletin.png'
    }], {
        '[115,55,315,190]': 'if(LLevel.fetch_data("top_l5r_safe")==false){LLevel.update(2,2);}else{LLevel.update(3,0);}',
        '[130,200,300,400]': 'if(LLevel.fetch_data("has_bottomsafe_key")==true){LLevel.loaded_room.linked_overlay.scene_data.push({ type: "web_image", url: "https://dl.dropboxusercontent.com/s/nte37zh5dl88vkl/L5r_bottom-open--overlay.png", location: [0, 197], set_size: [400, 303] });LLevel.push_data("bottom_l5r_safe",true);LLevel.push_data("has_bottomsafe_key", false);}else if(LLevel.fetch_data("bottom_l5r_safe")==true){LLevel.update(1,1);}',
        '[0,290,90,400]': 'LLevel.update(3,1);',
        '[335,215,400,295]': 'LLevel.update(3,2);',
        '[350,0,WIDTH,HEIGHT]': 'LLevel.update(0,2);',
        '[0,0,50,HEIGHT]': 'LLevel.update();'
    }, {}, function() {}, function() {}, new Room('Lv5right_overlay', [{}]));
    const L5r_topsafe_closeup = new Room('Lv5right_top-safe-closeup', [{
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
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(2,0);' //put this last so the update order gets to the numpad first
    }, local_data = { correct_pass: [4, 2, 0], cur_pass: [], blank_pass: [] }, on_update = function() {
        this.local_data['blank_pass'] = [];
        if (this.local_data['cur_pass'].length >= this.local_data['correct_pass'].length) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('top_l5r_safe', true);
                LLevel.update(2, 0);
                LLevel.loaded_room.linked_overlay.scene_data.push({
                    type: 'web_image',
                    url: 'https://dl.dropboxusercontent.com/s/f5uisdv3eci4r3w/L5r_top-open--overlay.png',
                    set_size: [399, 192]
                }); // because other safe needs too
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const L5r_topsafe_inside = new Room('Lv5right_top-safe-inside', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/w4iuqsdzwmhx6gl/safe_inside.png'
    }], {
        '[170,270,319,343]': 'LLevel.push_data("has_bottomsafe_key", true);LLevel.loaded_room.linked_overlay=null;',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(2,0);'
    }, {}, function() {}, function() {}, new Room('Lv5right_top-safe-inside-overlay', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png',
        location: [170, 270],
        set_size: [149, 73]
    }]));
    const L5r_stickynote_left_closeup = new Room('Lv5right_sticky-note_left', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/qvrorheto5wp93k/sticky_note-green-closeup.png'
    }, { type: 'text', location: [50, 250], text: '7872 South Rd.' }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(2,0);'
    });
    const L5r_stickynote_right_closeup = new Room('Lv5right_sticky-note_right', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/iuu8rjudkagk0lx/sticky_note-yellow-closeup.png'
    }, { type: 'text', location: [50, 250], text: '72 Creek Drive' }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(2,0);'
    });
    const L5rr = new Room('Lv5_right2', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/q4gpdoj1nobssl9/L5rr.png'
    }], {
        '[215,0,325,90]': 'if(LLevel.fetch_data("popped_balloon")==false){LLevel.update(5,1);}else{LLevel.update(5,2);}',
        '[245,400,394,473]': 'if(LLevel.fetch_data("popped_balloon")==true&&LLevel.fetch_data("has_key")==false){LLevel.loaded_room.linked_overlay.scene_data.pop();LLevel.push_data("has_key", true);}',
        '[0,430,115,480]': 'LLevel.update(2,1);',
        '[0,0,50,HEIGHT]': 'if(LLevel.fetch_data("bulletin")==true){LLevel.update(0,1);}else{LLevel.update(2,0);}'
    }, {}, function() {}, function() {
        if (LLevel.fetch_data("popped_balloon") == true) { LLevel.loaded_room.linked_overlay.scene_data.push({ type: 'web_image', url: 'https://dl.dropboxusercontent.com/s/m8q3p8rjgi90iiz/key_exit.png', location: [245, 400], set_size: [149, 73] }) }
    }, new Room('Lv5right2_overlay', []));
    const L5rr_paper_closeup = new Room('Lv5right2_paper-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/n9iakyp9ihe8p6a/paper_slip--closeup.png'
    }, { type: 'text', location: [135, 250], text: '4̴̡̭̦͎̑̍̅̓͘͜2̵̨̲̞̦̔̓0̸̢̙͗̌̂́͒', font: '45pt Consolas' }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,2);'
    });
    const L5rr_balloons_closeup = new Room('Lv5right2_balloons-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/gn01fuyaxb3em2p/L5rr_with-balloon-closeup.png'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'if(LLevel.fetch_data("has_needle")==true){LLevel.update(5,2);LLevel.push_data("popped_balloon",true);}{LLevel.update(0,2);}'
    });
    const L5rr_balloons_closeup_no_red = new Room('Lv5right2_balloons_closeup_no-red', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/7q7mfdgss480adz/L5rr_no-balloon-closeup.png'
    }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(0,2);'
    });
    const L5eS1 = new Room('Lv5_entrance-sub1', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/n9lqypl2yum39du/L5e_sub1.png'
    }], {
        '[115,200,300,460]': 'if(LLevel.fetch_data("has_lectern_key")==true){LLevel.loaded_room.linked_overlay.scene_data.push({type: "web_image", url: "https://dl.dropboxusercontent.com/s/92dwogyy16rr26o/L5e_sub1_no-chain--overlay.jpg", location: [0,193], set_size: [400,307]});LLevel.update(4,1);}',
        '[260,80,360,160]': 'if(LLevel.fetch_data("has_needle")==false){LLevel.update(4,2);}else{LLevel.update(5,0);}',
        '[350,0,WIDTH,HEIGHT]': 'LLevel.update(1,1);'
    }, {}, function() {}, function() {}, new Room('L5entrance-sub1_overlay', [{}]));
    const L5eS1_torch_closeup = new Room('Lv5entrance-sub1_torch-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/ekk22yx47khipmm/torch-closeup.jpg'
    }], {
        '[45,215,365,280]': 'LLevel.push_data("has_needle",true);alert("You took off a bar from the torch as a needle! ");LLevel.update(5,0);',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);'
    }, {}, function() {}, function() {}, new Room('L5eS1_torch-closeup_overlay', [{}]));
    const L5eS1_torch_closeup_no_needle = new Room('Lv5entrance-sub1_torch-closeup--no-needle', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/o3eiemh5r3l2g0h/blank_wall_dungeon.png'
    }, { type: "web_image", url: "https://dl.dropboxusercontent.com/s/stxdue1n29w05vg/fire_minus-wire.png" }], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);'
    });
    const L5eS1_lectern_closeup = new Room('Lv5entrance-sub1_lectern-closeup', [
        { type: 'text', location: [0, 14], text: 'opportuNities multiply as they arE seized.', font: '13pt Consolas' },
        { type: 'text', location: [0, 34], text: 'Victorious warriors win first and thEn go', font: '13pt Consolas' },
        { type: 'text', location: [0, 48], text: 'to war, while defeated warrioRs GO to war', font: '13pt Consolas' },
        { type: 'text', location: [0, 62], text: 'first and theN seek to wiN.', font: '13pt Consolas' },
        { type: 'text', location: [0, 82], text: 'All men can see these tactics whereby i', font: '13pt Consolas' },
        { type: 'text', location: [0, 96], text: 'conquer, but what none can see is the', font: '13pt Consolas' },
        { type: 'text', location: [0, 110], text: 'strateGy out of whIch Victory is Evolved.', font: '13pt Consolas' },
        { type: 'text', location: [0, 130], text: 'regard YOUr soldiers as your children', font: '13pt Consolas' },
        { type: 'text', location: [0, 144], text: 'and they will follow yoU into the', font: '13pt Consolas' },
        { type: 'text', location: [0, 158], text: 'deePest valleys.', font: '13pt Consolas' },
        { type: 'text', location: [0, 178], text: 'Sun Tzu, The Art of War', font: '13pt Consolas' },
        { type: 'text', location: [0, 198], text: 'https://tinyurl.com/IMG2645', font: '13pt Consolas' },
        { type: 'text', location: [0, 218], text: 'EASTER EGG', font: '13pt Consolas' },
        { type: 'web_image', location: [50, 250], set_size: [175, 250], url: 'https://dl.dropboxusercontent.com/s/hfrrwisgc2clcja/the_art_of_war.png' }
    ], {
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,0);'
    });
    const L5rS1 = new Room('Lv5_right-sub1', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/es5ulu8mn9wje0d/L5r_sub1.png'
    }], {
        '[130,195,300,400]': 'LLevel.update(2,0);',
        '[350,0,WIDTH,HEIGHT]': 'LLevel.update(1,2);',
        '[0,0,50,HEIGHT]': 'LLevel.update(1,0);'
    });
    const L5rrS1 = new Room('Lv5_right2-sub1', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/hjn9ayf7hqlydpr/L5rr_sub1.png'
    }], {
        '[130,400,280,460]': 'if(LLevel.fetch_data("bottom_chest")==false){LLevel.update(4,0);}',
        '[255,430,405,500]': 'if(LLevel.fetch_data("has_lectern_key")==false){LLevel.loaded_room.linked_overlay.scene_data.pop();LLevel.push_data("has_lectern_key",true);}',
        '[0,0,50,HEIGHT]': 'LLevel.update(1,1);'
    }, {}, function() {}, function() {}, new Room('Lv5right2-sub1_overlay', [{}]));
    const L5rrS1_chest_closeup = new Room('Lv5right2-sub1_chest-closeup', [{
        type: 'web_image',
        url: 'https://dl.dropboxusercontent.com/s/s2dti88axmykqem/L5rr_sub1_chest-closeup.png'
    }], {
        '[25,210,90,320]': 'this.local_data["cur_pass"][0]=parseInt(prompt("Enter number for slot 1: "));',
        '[120,210,190,320]': 'this.local_data["cur_pass"][1]=parseInt(prompt("Enter number for slot 2: "));',
        '[220,210,290,320]': 'this.local_data["cur_pass"][2]=parseInt(prompt("Enter number for slot 3: "));',
        '[320,210,370,320]': 'this.local_data["cur_pass"][3]=parseInt(prompt("Enter number for slot 4: "));',
        '[0,0,WIDTH,HEIGHT]': 'LLevel.update(1,2);'
    }, local_data = { correct_pass: [7, 8, 7, 2], cur_pass: [null, null, null, null], blank_pass: [null, null, null, null] }, on_update = function() {
        this.local_data['blank_pass'] = [null, null, null, null];
        if (all_same_type(this.local_data['cur_pass'].concat(this.local_data['correct_pass']))) {
            if (equals(this.local_data['cur_pass'], this.local_data['correct_pass'])) {
                this.local_data['cur_pass'] = this.local_data['blank_pass'];
                LLevel.push_data('bottom_chest', true);
                LLevel.update(1, 2);
                LLevel.loaded_room.linked_overlay.scene_data.push({
                    type: 'web_image',
                    url: 'https://dl.dropboxusercontent.com/s/5lt5h782sn3gicj/L5rr_sub1_open-chest--overlay.png',
                    location: [0, 286],
                    set_size: [400, 214]
                });
                LLevel.loaded_room.linked_overlay.scene_data.push({
                    type: 'web_image',
                    url: 'https://dl.dropboxusercontent.com/s/tmb2nk1sibjoaex/key--cropped.png',
                    location: [255, 430],
                    set_size: [150, 70]
                });
            } else { this.local_data['cur_pass'] = this.local_data['blank_pass']; }
        }
        changeHTML('text3', this.local_data['cur_pass']);
    });
    const Level5 = new Level('L5', new Grid([6, 3], [
        [L5e, L5r, L5rr],
        [L5eS1, L5rS1, L5rrS1],
        [L5r_open, L5rr_paper_closeup, L5r_topsafe_closeup],
        [L5r_topsafe_inside, L5r_stickynote_left_closeup, L5r_stickynote_right_closeup],
        [L5rrS1_chest_closeup, L5eS1_lectern_closeup, L5eS1_torch_closeup],
        [L5eS1_torch_closeup_no_needle, L5rr_balloons_closeup, L5rr_balloons_closeup_no_red]
    ]), pos = [0, 0], { has_key: false, has_bulletin_key: false, has_bottomsafe_key: false, has_lectern_key: false, has_needle: false, bulletin: true, top_l5r_safe: false, bottom_l5r_safe: false, bottom_chest: false, popped_balloon: false });
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