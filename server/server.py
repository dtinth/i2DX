import tornado
from tornado import websocket
import OSC

client = OSC.OSCClient()
client.connect( ('127.0.0.1', 9000) )

class EchoWebSocket(websocket.WebSocketHandler):
	def open(self):
		self.write_message("Ready")

	def on_message(self, message):
		if message[0] == '1':
			msg = OSC.OSCMessage('/key/' + message[1])
			msg.append(1.0)
			client.send(msg)
		elif message[0] == '0':
			msg = OSC.OSCMessage('/key/' + message[1])
			msg.append(0.0)
			client.send(msg)

	def on_close(self):
		print "closed"

application = tornado.web.Application([
    (r"/", EchoWebSocket),
])

if __name__ == "__main__":
    application.listen(9876)
    tornado.ioloop.IOLoop.instance().start()

