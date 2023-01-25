#!/usr/bin/python
import pygame
import pygame.locals as pg
from pygame.math import Vector2
import random
w=720
h=480
def stepGrid(grid):
    newgrid=[]
    for x in range(len(grid)):
        tgrid=[]
        gw=len(grid)-1

        for y in range(len(grid[x])):
            gh=len(grid[x])-1
            total=0
            if x>0:
                if grid[x-1][y]:
                    total+=1
                if y<gh:
                    if grid[x-1][y+1]:
                        total+=1
                if y>0:    
                    if grid[x-1][y-1]:
                        total+=1
            if x<gw:
                if grid[x+1][y]:
                    total+=1
                if y<gh:
                    if grid[x+1][y+1]:
                        total+=1
                if y>0:
                    if grid[x+1][y-1]:
                        total+=1
            if y>0:
                if grid[x][y-1]:
                    total+=1
            if y<gh:
                if grid[x][y+1]:
                    total+=1
            if (total==2 or total==3) and (grid[x][y]):
                tgrid.append(True)
            elif (total==3) and (not grid[x][y]):
                tgrid.append(True)
            else:
                tgrid.append(False)
        newgrid.append(tgrid)
    return newgrid

class Player:
    texture:pygame.Surface
    rect:pygame.Rect
    velocity:Vector2
    accel:Vector2
    def __init__(self,width,height,color=(255,255,0)):
        temp_texture=pygame.Surface((width,height))
        temp_texture=temp_texture.convert()
        temp_texture.fill(color)
        self.texture=temp_texture
        self.rect=pygame.Rect(0,0,width,height)
        self.velocity=Vector2(0,0)
        self.accel=Vector2(0,0)
    def update(self,walls):
        self.move(walls)
        self.velocity+=self.accel
        self.accel=Vector2(0,1)
        self.velocity*=0.99
        self.velocity.x=max(min(self.velocity.x,50),-50)
        self.velocity.y=max(min(self.velocity.y,50),-50)
        
    def move(self,walls):
        dx,dy=self.velocity.x,self.velocity.y
        # Move each axis separately. Note that this checks for collisions both times.
        if dx != 0:
            self.move_single_axis(walls,dx, 0)
        if dy != 0:
            self.move_single_axis(walls,0, dy)
    
    def move_single_axis(self, walls, dx, dy):
        
        # Move the rect
        self.x += dx
        self.y += dy

        # If you collide with a wall, move out based on velocity
        for wall in walls:
            if self.rect.colliderect(wall):
                if dx > 0: # Moving right; Hit the left side of the wall
                    self.rect.right = wall.left
                if dx < 0: # Moving left; Hit the right side of the wall
                    self.rect.left = wall.right
                if dy > 0: # Moving down; Hit the top side of the wall
                    self.rect.bottom = wall.top
                if dy < 0: # Moving up; Hit the bottom side of the wall
                    self.rect.top = wall.bottom

    @property
    def x(self):
        """The x position of the player"""
        return self.rect.x
        
    @x.setter
    def x(self,value):
        self.rect.x=value

    @property
    def y(self):
        """The y position of the player"""
        return self.rect.y
    @y.setter
    def y(self,value):
        self.rect.y=value
        
    @property
    def width(self):
        """The width of the player"""
        return self.rect.w
        
    @property
    def height(self): 
        """The height of the player"""
        return self.rect.h

    @property
    def pos(self):
        """The position of the player as a Vector2"""
        return Vector2(self.rect.x,self.rect.y)
    @pos.setter
    def pos(self,value:Vector2):
        self.rect.x=value.x
        self.rect.y=value.y
    
def main():
    pygame.init()
    screen=pygame.display.set_mode((w,h))
    background=pygame.Surface(screen.get_size())
    background=background.convert()
    background.fill((120,120,120))
    gw=w//10
    gh=h//10
    screen.blit(background,(0,0))
    drawtex=pygame.Surface((gw*20,gh*20))
    drawtex=drawtex.convert()
    camera=pygame.Rect(0,0,w,h)

    player=Player(10,10,(0,255,255))    
    grid=[]
    for x in range(gw):
        t_grid=[]
        for y in range(gh):
            t_grid.append(False)
        grid.append(t_grid)
    grid[5][5]=True
    grid[5][7]=True
    grid[6][6]=True
    grid[6][7]=True
    grid[7][6]=True
    frame=0
    
    while True:
        for event in pygame.event.get():
            if event.type==pg.QUIT:
                return
            elif event.type==pygame.KEYDOWN:
                if event.key==pg.K_w:
                    player.accel.y+=5
                elif event.key==pg.K_a:
                    player.accel.x-=5
                elif event.key==pg.K_d:
                    player.accel.x+=5
                elif event.key==pg.K_q:
                    return
                    
        frame+=1
        if frame>0:
            grid=stepGrid(grid)
            frame=0
        collision_candidates=[]
        total=0
        for x in range(gw):
            for y in range(gh):
                color=(0,0,0)
                if grid[x][y]:
                    color=(255,255,255)
                    total+=1
                p=pygame.Rect(x*20,y*20,20,20)
                pygame.draw.rect(drawtex,color,p)
                if grid[x][y]:
                    collision_candidates.append(p)
        player.update(collision_candidates)
        if total==0:
            for x in range(gw):
                t_grid=[]
                for y in range(gh):
                    t_grid.append(random.random()>0.5)
                grid.append(t_grid)
        screen.blit(drawtex,(0,0))  
        screen.blit(player.texture,player.rect)
        if player.x<0 or player.x>w or player.y<0 or player.y>h:
            player.pos=Vector2(w/2,h/2)
            player.velocity=Vector2(0,0)

        pygame.display.flip()
if __name__=="__main__": main()