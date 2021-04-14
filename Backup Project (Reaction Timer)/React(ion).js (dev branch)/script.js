window.onload = function() {
    var background = new Rectangle(getWidth(), getHeight());
    background.setColor(Color.red);
    add(background);
    var orig = new Date().getTime();
    var clicked = 0;
    setTimeout(function() {
        background.setColor(Color.green);
        mouseClickMethod(function() {
            if (clicked == 0) {
                println(new Date().getTime() - orig);
                clicked = 1;
            }
        })
    }, Randomizer.nextInt(9, 20) * 1e3);
    if (typeof start === 'function') {
        start();
    }
};