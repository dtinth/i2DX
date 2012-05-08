import sys
import libi2dx
from os import path
from autopy import key

class I2DXWebSocketAutoPy(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state):
		try:
			key.toggle(keys[key_id], state)
		except KeyError:
			print "key map not found : ", key_id

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketAutoPy)
