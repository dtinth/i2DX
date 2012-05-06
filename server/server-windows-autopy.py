import sys
import libi2dx
from os import path
from autopy import key

keys = {}
for line in open(path.join(path.dirname(sys.argv[0]), 'key-config.txt'), 'r').read().split('\n'):
	data = line.split()
	keys[data[0]] = data[1]

class I2DXWebSocketAutoPy(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state):
		try:
			key.toggle(keys[key_id], state)
		except KeyError:
			print "key map not found : ", key_id

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketAutoPy)
