window.onload = function() {
    // Code to integrate JS with HTML^^
    //CLASSES
    /**
     * @description  Essentially a better implementation of CodeHS Grid object - allows for usage in default function/class parameters
     * @class Grid
     * @param {list[2]} dimensions       A 2-item list for the dimensions of the generated 2D array (grid)
     * @param {list[list]} prefill_data  An optional argument that prefills the generated grid with data (MUST BE 2D array structure)
     */
    class Grid {
        constructor(dimensions, prefill_data = undefined) {
                this.dimensions = dimensions;
                // dimensions for the 2d array (width,height format)
                this.data = Array.from(Array(dimensions[0]), () => new Array(dimensions[1]));
                // makes a 2d array w/ dims from dimensions
                if (prefill_data != undefined) {
                    for (var i = 0; i < dimensions[0]; i++) {
                        for (var j = 0; j < dimensions[1]; j++) {
                            if (prefill_data[i][j] != undefined) {
                                this.data[i][j] = prefill_data[i][j];
                            }
                        }
                    }
                } // this code looks disgusting :/ make more efficient
            }
            /**
             * @description  A function that checks whether a position is index-able within a grid
             * @function inBound
             * @param {list[2]} pos  The position to be checked
             * @returns 
             */
        inBound(pos) {
                return check_bound([0, 0, this.dimensions[0], this.dimensions[1]], pos);
            }
            /**
             * @description  A function that sets a value inside a grid to another value
             * @function set
             * @param {list[2]} pos  The position inside the grid to change to val
             * @param {any} val      The value to change pos to
             * @returns 
             */
        set = (pos, val) => this.data[pos[0], pos[1]] = val;
        /**
         * @description  A function taht returns the value of a specific position inside the grid
         * @function get
         * @param {list[2]} pos  The position of the desired value inside the grid
         * @returns 
         */
        get(pos) {
            return this.data[pos[0], pos[1]];
        }
    }

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
                url: 'https://codehs.com/uploads/978cbcc781e32db59711ed28ad170591',
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

    /**
     * @description  A container for linking Room objects
     * @class Level
     * @param {string} name          The name for the entire level
     * @param {Grid} rooms           A grid (2D array) of Room objects
     * @param {list[2]} pos  The position of the player (and the position of the room to display)
     */
    class Level {
        constructor(name, rooms = undefined, pos = [0, 0]) {
                this.name = name;
                // the name of the level
                if (rooms == undefined) {
                    this.rooms = new Grid([1, 1], new Room(linked_overlay = new Room()));
                } else {
                    this.rooms = rooms;
                }
                // rooms is a grid of Room objects
                this.pos = pos;
                // the position at which the player is at
                this.loaded_room = this.rooms.data[this.pos[0]][this.pos[1]];
                // room loaded associated with the level
            }
            /**
             * @description  A function that updates the scene based on coordinates and moves the position of the loaded scene based on dx/dy
             * @function update
             * @param {int} dx  Move x by dx amount
             * @param {int} dy  Move y by dy amount
             */
        update(dx = 0, dy = 0) {
            var new_pos = [this.pos[0] + dy, this.pos[1] + dx];
            if (this.rooms.inBound(new_pos)) this.pos = new_pos;
            this.loaded_room = this.rooms.data[this.pos[0]][this.pos[1]];
        }
    }

    //FUNCTIONS
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

    /**
     * @description  Checks if a coordinate falls within a 4-coordinate boundary
     * @function check_bound
     * @param {list[4]} bound  A rectangle boundary to check whether coord is within
     * @param {list[2]} coord  A coordinate to check if it's in bound's rectangle
     * @return {bool}          Whether coord falls inside bound's rectangle
     */
    function check_bound(bound, coord) {
        //checks if coord is in bound; coord -> [x, y], bound -> [x1, y1, x2, y2]
        return (bound[0] <= coord[0] && coord[0] <= bound[2]) && (bound[1] <= coord[1] && coord[1] <= bound[3]);
    }

    /**
     * @whyimadethis  got lazy writing "document.getElementById..." all the time
     * @description  Changes HTML tag text by IDs
     * @function changeHTML
     * @param {string} id        The ID of the HTML tag to be changed
     * @param {string} new_text  The text to change to
     */
    function changeHTML(id, new_text) {
        document.getElementById(id).innerHTML = new_text;
    }

    function changeLevel(new_level) {
        LLevel = eval(new_level);
        LLevel.pos = [0, 0];
        LLevel.update();
    }

    //GLOBAL VARIABLES
    const WIDTH = getWidth();
    const HEIGHT = getHeight();
    var USER_NAME;
    var loaded_room;
    var LLevel;
    //GAME SETUP
    //TODO: set up room objects for all rooms in game
    //To Do: Change the need for "LLevel = __level-name__"; LLevel.pos = [0,0]; LLevel.update();" in action points for rooms
    const start_room = new Room('start_room', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/67b3fe870835f1df7d063cd6d9a1f654'
    }], { '[75,144,255,255]': 'USER_NAME=prompt("What is your name?","User000");LLevel.update(1,0)' });
    const level_select = new Room('level_select', [{
        type: 'web_image',
        location: [0, 0],
        url: 'https://codehs.com/uploads/17a255ac46fcbe31d6789d986d98af8c'
    }], {
        '[10,100,75,165]': 'LLevel = Level1; LLevel.pos = [0,0];LLevel.update();',
        '[90,100,160,165]': 'LLevel = Level2; LLevel.pos = [0,0];LLevel.update();',
        '[175,100,240,170]': 'LLevel = Level3; LLevel.pos = [0,0];LLevel.update();',
        '[250,100,320,170]': 'LLevel = Level4; LLevel.pos = [0,0];LLevel.update();',
        '[5,190,95,260]': 'LLevel = Level5; LLevel.pos = [0,0];LLevel.update();',
        '[90,190,165,260]': 'LLevel = Level6; LLevel.pos = [0,0];LLevel.update();',
        '[180,190,235,270]': 'LLevel = Level7; LLevel.pos = [0,0];LLevel.update();',
        '[250,200,325,260]': 'LLevel = Level8; LLevel.pos = [0,0];LLevel.update();'
    }, new Room('level_overlay'));
    const LevelStart = new Level('LStart', new Grid([1, 2], [
        [start_room, level_select]
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
        url: 'https://codehs.com/uploads/bef060442d7fb97e5775a3b5e953926c'
    }], {
        '[0,0,getWidth(),getHeight()]': 'LLevel=LevelStart;LLevel.pos = [0,0];LLevel.update();'
    });
    const Level1 = new Level('L1', new Grid([1, 1], [
        [L1e]
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
        '[0,0,getWidth(),getHeight()]': 'LLevel.loaded_room=start_room;'
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