var background=new Rectangle(getWidth(),getHeight());background.setColor(Color.green),add(background);var orig,a=0,clicked=!1;setTimer(function e(){(a+=1)>=Randomizer.nextInt(10,20)&&(background.setColor(Color.red),orig=(new Date).getTime(),stopTimer(e))},100),mouseClickMethod(function(){clicked||null==orig||(println(((new Date).getTime()-orig)/1e3),clicked=!0)});