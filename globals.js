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