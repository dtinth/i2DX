
import libi2dx
import OSC

client = OSC.OSCClient()
client.connect( ('127.0.0.1', 9000) )

class I2DXWebSocketOSC(libi2dx.I2DXWebSocket):
	def toggle_key(self, key_id, state, player):
		msg = OSC.OSCMessage('/player%s/%s' % (player, key_id))
		if state:
			state = 1.0
		else:
			state = 0.0
		msg.append(state)
		try:
			client.send(msg)
		except OSC.OSCClientError:
			print "cannot send OSC message"

if __name__ == "__main__":
	libi2dx.serve(I2DXWebSocketOSC)

