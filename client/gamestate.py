import cocos
from cocos.director import director
import game

class GameState():
    def __init__(self,dimensions):
        director.init(width=dimensions[0],height=dimensions[1],caption="lol game")
        director.show_FPS = True
        self.status = "in_game"
        s_game = game.Game()
        
        self.scenes = {"game":s_game}
        
    def run(self,scene_id):
        director.run(self.scenes[scene_id])
        