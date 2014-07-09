import tornado
from tornado import websocket
from os import path
import socket
import sys
import glob
from ConfigParser import RawConfigParser

config = RawConfigParser(allow_no_value=True)
config.read(path.join(path.dirname(sys.argv[0]), 'config.ini'))

clientdir = path.join(path.dirname(path.dirname(path.abspath(sys.argv[0]))), 'client')

class I2DXTopHandler(tornado.web.RequestHandler):
	def get(self):
		self.redirect('static/index.html')

def _glob(*largs):
	return [x[len(clientdir):] for x in glob.glob(path.join(clientdir, *largs))]

class I2DXComponentsHandler(tornado.web.RequestHandler):
	def get(self):
		self.set_header('Content-Type', 'text/javascript')
		for list in (_glob('layouts', '*.js'), _glob('skins', '*', 'skin.js')):
			for file in list:
				self.write('document.write("<scr" + "ipt src=\\"%s\\"></scr" + "ipt>");\n' % ('/static' + file.replace('\\', '/')))

class I2DXWebSocket(websocket.WebSocketHandler):

	def allow_draft76(true):
		return True

	def open(self):
		self.write_message("Ready")
		self.stream.socket.setsockopt(socket.SOL_TCP, socket.TCP_NODELAY, 0)
		print "i2dx connection opened!"

	def on_message(self, message):
		parts = message.split(';')
		if parts[0] == '1':
			self.toggle_key(parts[1], True, parts[2])
		elif parts[0] == '0':
			self.toggle_key(parts[1], False, parts[2])
		elif parts[0] == 'junk':
			pass
		else:
			print "unknown message", parts[0]

	def on_close(self):
		print "connection closed"


class NoCacheStaticFileHandler(tornado.web.StaticFileHandler):
	def set_extra_headers(self, path):
		self.set_header("Cache-control", "no-cache")

def serve(handler):

	global config, clientdir

	application = tornado.web.Application([
		(r"/", I2DXTopHandler),
		(r"/addons", I2DXComponentsHandler),
		(r"/ws", handler),
		(r"/static/(.*)", NoCacheStaticFileHandler, { "path": clientdir }),
	])

	port = config.getint('listen', 'port')
	address = config.get('listen', 'address')
	print "listening on port", port, "address", address

	application.listen(port)

	tornado.ioloop.IOLoop.instance().start()

