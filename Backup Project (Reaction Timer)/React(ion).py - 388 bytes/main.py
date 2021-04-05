import random as r,time as t,pygame as p
from pygame.locals import *
p.init()
sc=p.display.set_mode((640,480))
sw,c=False,p.time.Clock()
sc.fill((0,255,0))
while True:
	for e in p.event.get():
		if e.type==MOUSEBUTTONUP:
			if sw:print(t.time()-tstart);p.quit();exit(0)
	if sw:sc.fill((255,0,0))
	p.display.flip();dt=c.tick(60)
	if r.randint(0,120)==69:sw=True;tstart=t.time()