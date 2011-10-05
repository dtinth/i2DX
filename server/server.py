import tornado
from tornado import websocket
import OSC
from os import path

client = OSC.OSCClient()
client.connect( ('127.0.0.1', 9000) )

class I2DXTopHandler(tornado.web.RequestHandler):
	def get(self):
		self.redirect('static/index.html')

class I2DXWebSocket(websocket.WebSocketHandler):
	def open(self):
		self.write_message("Ready")
		print "connection opened"

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

clientdir = path.join(path.dirname(path.dirname(path.abspath(__file__))), 'client')
application = tornado.web.Application([
	(r"/", I2DXTopHandler),
    (r"/ws", I2DXWebSocket),
], static_path=clientdir)

if __name__ == "__main__":
    application.listen(9876)
    tornado.ioloop.IOLoop.instance().start()

