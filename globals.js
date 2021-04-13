//MARK: Global Variables
const WIDTH = 400; // would try to use getWidth(), but CodeHS JS library doesn't load fast enough for this to be viable 
const HEIGHT = 500; // (continuing) because this needs to be loaded after the CodeHS and JQuery libraries are loaded in, but before script.js
var USER_NAME;
var loaded_room;
var LLevel;
//MARK: Classes
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
 * @description  A container for linking Room objects
 * @class Level
 * @param {string} name  The name for the entire level
 * @param {Grid} rooms   A grid (2D array) of Room objects
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
         * @description  A function that updates the scene based on coordinates and moves the loaded position to new_x, new_y
         * @function update
         * @param {int} new_x  New x position to go to
         * @param {int} new_y  New y position to go to
         */
    update(new_x = 0, new_y = 0) {
        if (this.rooms.inBound([new_y, new_x])) this.pos = [new_y, new_x];
        this.loaded_room = this.rooms.data[this.pos[0]][this.pos[1]];
    }
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
            var image_pos = ('location' in object) ? [object.location[0], object.location[1]] : [0, 0];
            _load = new WebImage(object.url);
            _load.setPosition(image_pos[0], image_pos[1]);
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
            var text_font = ('font' in object) ? object['font'] : '30pt Consolas'; //YES!! Got to use ? operator
            _load = new Text(object['text'], text_font);
            _load.setPosition(object.location[0], object.location[1]);
            if ('color' in object) {
                _load.setColor(object.color);
            } else {
                _load.setColor(Color.black);
            }
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

const equals = (list1, list2) => JSON.stringify(list1) === JSON.stringify(list2);