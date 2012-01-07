
import libi2dx
from autopy import key

keys = {
	'0': 'q',
	'1': 'w',
	'2': 'e',
	'3': 'r',
	'4': 't',
	'5': 'y',
	'6': 'u',
	'7': 'i',
	'8': 'o',
	'9': 'p'
}

class I2DXWebSocketAutoPy(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state):
		try:
			key.toggle(keys[key_id], state)
		except KeyError:
			print "key map not found : ", key_id

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketAutoPy)
