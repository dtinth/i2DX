
import libi2dx

class I2DXWebSocketOSC(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state, player):
		print 'key', key_id, state, "player %s" % player

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketOSC)

