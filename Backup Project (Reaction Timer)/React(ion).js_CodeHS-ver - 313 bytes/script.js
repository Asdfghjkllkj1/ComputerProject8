var b=new Rectangle(getWidth(),getHeight());b.setColor(Color.green);add(b);var a=0;var c=0;var o;setTimer(function d(){if((a+=1)>=Randomizer.nextInt(9,20)){b.setColor(Color.red);o=new Date().getTime();stopTimer(d);}},99);mouseClickMethod(function(){if(c==0&&o!=null){println(((new Date).getTime()-o)/1e3);c=1;}});