#!/usr/bin/env python
# _*_ coding: utf-8 _*_
# _*_ author: fxzengfrank _*_
#
import os, time, json
import traceback
from module import xlog
from threading import Thread
from tornado import web, websocket, ioloop
from tornado.httpserver import HTTPServer
from tornado.log import enable_pretty_logging
#
class WebServer():
    def __init__(self, main):
        self.main = main
        self.main_dir = main.main_dir
        self.ssl_dir = os.path.join(self.main_dir, 'web', 'ssl')
        self.static_dir = os.path.join(self.main_dir, 'web', 'static')
        self.template_dir = os.path.join(self.main_dir, 'web', 'template')
        self.component_dir = os.path.join(self.template_dir, 'component')
        #
        self.wsockets = []
        #
        enable_pretty_logging()
        #
        self.conf = dict(
            port = 9080,
            ssl = False,
            certfile = 'cert.crt',
            keyfile = 'cert.key',
            autoreload = True,
            debug = False,
            )
        self.main.conf.load_conf('webserver', self.conf)
        #
        self.application = web.Application([
            (r'/?', IndexHandler, dict(main=self.main)),
            (r'/static/(.*)', web.StaticFileHandler, dict(path=self.static_dir)),
            (r'/(favicon.ico)', web.StaticFileHandler, dict(path=self.static_dir)),
            (r'/wsapi', WSAPIHandler, dict(main=self.main)),
            (r'/api', APIHandler,dict(main=self.main))
        ],
            static_path = self.static_dir,
            template_path = self.template_dir,
            autoreload = self.conf['autoreload'],
            debug = self.conf['debug'],
        )
        if self.conf['ssl']:
            ssl_options = {
                'certfile': os.path.join(self.ssl_dir, self.conf['certfile']),
                'keyfile': os.path.join(self.ssl_dir, self.conf['keyfile']),
            }
            self.http_server = HTTPServer(self.application, ssl_options=ssl_options)
        else:
            self.http_server = HTTPServer(self.application)
    #
    def run_forever(self):
        try:
            self.http_server.bind(self.conf['port'])
            self.http_server.start(num_processes=1)
            xlog.info('Web server started on port %d' % self.conf['port'])
            print('Press "Ctrl+C" to exit.\n')
            ioloop.IOLoop.instance().current().start()
        except KeyboardInterrupt:
            print('"Ctrl+C" received, exited.\n')
            pass
        except:
            print traceback.format_exc()
    #
    def ws_message(self, message):
        try:
            for ws in self.wsockets:
                ws.write_message(message)
        except:
            print traceback.format_exc()
#
class BaseHandler(web.RequestHandler):
    #
    def initialize(self, main):
        self.main = main
#
class IndexHandler(BaseHandler):
    #
    def get(self, *args):
        self.render('index.html')
#
class APIHandler(BaseHandler):
    #
    def get(self, *args):
        self.main.server.ws_message('page1')
        self.finish('OK')
#
class WSAPIHandler(websocket.WebSocketHandler):
    #
    def initialize(self, main):
        self.main = main
    #
    def check_origin(self, origin):
        return True
    #
    def open(self):
        self.main.server.wsockets.append(self)
        print("WebSocket opened")
    #
    def on_message(self, message):
        print("WebSocket message %s"%message)
    #
    def on_close(self):
        self.main.server.wsockets.remove(self)
        print("WebSocket closed")
#