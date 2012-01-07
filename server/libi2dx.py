import tornado
from tornado import websocket
from os import path
import socket
import sys

class I2DXTopHandler(tornado.web.RequestHandler):
	def get(self):
		self.redirect('static/index.html')

class I2DXWebSocket(websocket.WebSocketHandler):
	def open(self):
		self.write_message("Ready")
		self.stream.socket.setsockopt(socket.SOL_TCP, socket.TCP_NODELAY, 0)
		print "connection opened"

	def on_message(self, message):
		if message[0] == '1':
			self.toggle_key(message[1:], True)
		elif message[0] == '0':
			self.toggle_key(message[1:], False)

	def on_close(self):
		print "closed"

def serve(handler):
	clientdir = path.join(path.dirname(path.dirname(path.abspath(sys.argv[0]))), 'client')
	application = tornado.web.Application([
		(r"/", I2DXTopHandler),
		(r"/ws", handler),
	], static_path=clientdir)
	application.listen(9876)
	tornado.ioloop.IOLoop.instance().start()
