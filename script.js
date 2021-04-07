window.onload = function() {
    // Code to integrate JS with HTML, and loading globals.js with jquery^^
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

    //MARK: Functions
    /**
     * @description  Loads a scene based on scene data
     * @function load_scene
     * @param {list} raw_data  A list of objects telling the function how to load the scene
     */
    function load_scene(raw_data) {
        raw_data.forEach(function(object, index) {
            var _load;
            if (object.type == 'web_image') {
                _load = new WebImage(object.url);
                _load.setPosition(object.location[0], object.location[1]);
                if ('set_size' in object) {
                    //check needed because set_size optional
                    _load.setSize(object.set_size[0], object.set_size[1]);
                } else {
                    _load.setSize(WIDTH, HEIGHT);
                }
                //get image and set _load to data
            } else if (object.type == 'rectangle') {
                _load = new Rectangle(object.dim[0], object.dim[1]);
                _load.setPosition(object.location[0], object.location[1]);
                _load.setColor(object.color);
                //get rect info -> _load
            } else if (object.type == 'circle') {
                _load = new Circle(object.radius);
                _load.setPosition(object.location[0], object.location[1]);
                _load.setColor(object.color);
                //get circle info -> _load
            } else if (object.type == 'text') {
                _load = new Text(object['text'], object['font']);
                _load.setPosition(object.location[0], object.location[1]);
                _load.setColor(object.color);
                //get text info -> _load
            } else if (object.type == 'line') {
                _load = new Line(object.location[0], object.location[1], object.location[2], object.location[3]);
                _load.setColor(object.color);
                _load.setLineWidth(object.line_width);
                //get line info -> _load
            } else if (object.type == 'arc') {
                var _angle_measure;
                if ('angle_unit' in object) {
                    //angle unit: 0 -> degrees, 1 -> radians
                    _angle_measure = object.angle_unit;
                } else {
                    _angle_measure = 0;
                }
                _load = new Arc(object.radius, object.arc_angles[0], object.arc_angles[1], _angle_measure);
                _load.setPosition(object.location[0], object.location[1]);
                _load.setColor(object.color);
                //get arc info -> _load
            } else if (object.type == 'oval') {
                _load = new Oval(object.dim[0], object.dim[1]);
                _load.setPosition(object.location[0], object.location[1]);
                _load.setColor(object.color);
            } else {
                //not readable format; tell user we can't read type
                console.log("Couldn't read object " + index + ", type '" + object.type + "' in scene. ");
                return; //exit the nameless function called by forEach
            }
            /*
            if (object.type!='web_image') {
              _load.setColor(object.color);
            }
            ommitted because web_image might not be the only non-colored type
            */
            add(_load);
            //displays _load, whatever it may be
        });
    }
    /* Scene Data Info
    NOTE: the later in the dict an object appears, the "newer" it will be displayed
      "index_name":{
        "type":"object_type", 
        "location": [x,y],  //(type=line)[x1, y1, x2, y2]
        (type=web_image)"url":"object_url",
        (type=web_image)"set_size":(size_x, size_y),
        (type!=web_image)"color":Color.color,
        (type=rect/oval)"dim":[width,height],
        (type=circle/arc)"radius":"circle_radius",
        (type=text)"text":"object_text", 
        (type=text)"font":"object_font",
        (type=line)"line_width":line_width,
        (type=arc)"arc_angles":[start_angle, end_angle]
        (type=arc)"angle_unit":(0 for degrees, 1 for radians; default=0)
      }
      possible types: 
      web_image DONE
      rectangle DONE
      circle    DONE
      text      DONE
      line      DONE
      arc       DONE
      oval      DONE
     */
    /* From attempt at global js files
    function include(file) {
        var script = document.createElement('script');
        script.src = file;
        script.type = 'text/javascript';
        script.defer = true;
        document.getElementsByTagName('head').item(0).appendChild(script);
    }
    */
    //MARK: Global Variables
    const WIDTH = getWidth();
    const HEIGHT = getHeight();
    var USER_NAME;
    var loaded_room;
    var LLevel;
    //MARK: Game Setup
    //TODO: set up room objects for all rooms in game
    //To Do: Change the need for "LLevel = __level-name__"; LLevel.pos = [0,0]; LLevel.update();" in action points for rooms
    const start_room = new Room('start_room', [{
            type: 'web_image',
            location: [0, 0],
            url: 'http://dl.dropboxusercontent.com/s/2e7xzs8umr1ya6n/start_room.png'
        },
        {
            type: 'text',
            location: [135, 285],
            text: 'start',
            font: '30pt Consolas',
            color: Color.black
        },
        {
            type: 'text',
            location: [110, 425],
            text: 'credits',
            font: '30pt Consolas',
            color: Color.black
        }, {
            type: 'text',
            location: [37, 100],
            text: 'Escape the Room',
            font: '30pt Consolas',
            color: Color.black
        }, {
            type: 'text',
            location: [270, 500],
            text: 'v0.0.01pre-alpha',
            font: '11pt Consolas',
            color: Color.black
        }
    ], {
        '[90,225,290,322]': 'if(USER_NAME==undefined){USER_NAME=prompt("What is your name?","User000")};LLevel.update(1,0);',
        '[100,365,270,440]': 'LLevel.update(2,0);'
    });
    const level_select = new Room('level_select', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://dl.dropboxusercontent.com/s/bx4vsrex31dn9tx/levels.png'
    }, {
        type: 'text',
        location: [70, 65],
        text: 'Level select',
        font: '30pt Consolas',
        color: Color.black
    }, {
        type: 'text',
        location: [270, 475],
        text: 'back',
        font: '30pt Consolas',
        color: Color.black
    }], {
        '[31,85,125,167.]': 'LLevel = Level1; LLevel.pos = [0,0];LLevel.update();',
        '[153,85,250,165]': 'LLevel = Level2; LLevel.pos = [0,0];LLevel.update();',
        '[282,85,375,164]': 'LLevel = Level3; LLevel.pos = [0,0];LLevel.update();',
        '[30,195,124,277]': 'LLevel = Level4; LLevel.pos = [0,0];LLevel.update();',
        '[152,200,250,280]': 'LLevel = Level5; LLevel.pos = [0,0];LLevel.update();',
        '[280,200,375,270]': 'LLevel = Level6; LLevel.pos = [0,0];LLevel.update();',
        '[90,300,185,380]': 'LLevel = Level7; LLevel.pos = [0,0];LLevel.update();',
        '[220,300,310,380]': 'LLevel = Level8; LLevel.pos = [0,0];LLevel.update();',
        '[255,425,395,495]': 'LLevel.update()'
    }, new Room('level_overlay'));
    const credits = new Room('credits', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://dl.dropboxusercontent.com/s/zj92mm0ebqh727z/credits.png'
    }, {
        type: 'text',
        location: [270, 475],
        text: 'back',
        font: '30pt Consolas',
        color: Color.black
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
    var L1e = new Room('Lv1_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://dl.dropboxusercontent.com/s/cn8tnhptljq2hsa/L1e.png'
    }], {
        '[0,0,50,500]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();',
        '[350,0,400,500]': 'LLevel.update(1,0);'
    });
    var L1r = new Room('Lv1_right', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://dl.dropboxusercontent.com/s/6advobsa2hmkhhs/L1r.png'
    }], {
        '[0,0,50,500]': 'LLevel.update(0,0);'
    })
    const Level1 = new Level('L1', new Grid([1, 2], [
        [L1e, L1r]
    ]), pos = [0, 0]);
    var L2e = new Room('Lv2_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/c75b69cd74f41b1c690b981edd438771'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level2 = new Level('L2', new Grid([1, 1], [
        [L2e]
    ]), pos = [0, 0]);
    var L3e = new Room('Lv3_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/8a0ff0269c38c322e4dd54928a37e1e8'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level3 = new Level('L3', new Grid([1, 1], [
        [L3e]
    ]), pos = [0, 0]);
    var L4e = new Room('Lv4_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/3f668e244b2c250c27b96f41d8494c07'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level4 = new Level('L4', new Grid([1, 1], [
        [L4e]
    ]), pos = [0, 0]);
    var L5e = new Room('Lv5_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/423a283535121945fcdc926c85febd0e'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level5 = new Level('L5', new Grid([1, 1], [
        [L5e]
    ]), pos = [0, 0]);
    var L6e = new Room('Lv6_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/3ce76bc733da05177532fbd004dd250d'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level6 = new Level('L6', new Grid([1, 1], [
        [L6e]
    ]), pos = [0, 0]);
    var L7e = new Room('Lv7_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/fe193d750c155a8d367b45ee5537b916'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level7 = new Level('L7', new Grid([1, 1], [
        [L7e]
    ]), pos = [0, 0]);
    var L8e = new Room('Lv8_entrance', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/779ee02bf2672c86766750985b3db283'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
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