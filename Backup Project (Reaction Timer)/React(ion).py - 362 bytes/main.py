import random as r,time as t,pygame as p
from pygame.locals import *
p.init()
s=p.display.set_mode((640, 480))
w,c=0,p.time.Clock()
s.fill((0,255,0))
while 1:
	for e in p.event.get():
		if e.type==MOUSEBUTTONUP and w:
			print(t.time()-ts);p.quit();exit(0)
	if w:s.fill((255,0,0))
	p.display.flip();c.tick(60)
	if r.randint(0,120)==69:w=1;ts=t.time()