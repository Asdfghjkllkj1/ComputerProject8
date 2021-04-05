window.onload = function() {
    var background = new Rectangle(getWidth(), getHeight());
    background.setColor(Color.green);
    add(background);
    var a = 0;
    var orig;
    var clicked = false;

    setTimer(function b() {
        a += 1;
        if (a >= Randomizer.nextInt(10, 20)) {
            background.setColor(Color.red);
            orig = new Date().getTime();
            stopTimer(b);
        }
    }, 100);
    mouseClickMethod(function() {
        if (!clicked && orig != undefined) {
            document.getElementById('time').innerHTML = (new Date().getTime() - orig) / 1000 + 's';
            clicked = true;
        }
    });
    if (typeof start === 'function') {
        start();
    }
};