
import libi2dx
from autopy import key

keys = "qwertyuiop"

class I2DXWebSocketAutoPy(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state):
		key.toggle(keys[int(key_id)], state)

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketAutoPy)
