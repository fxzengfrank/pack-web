#!/usr/bin/env python
# _*_ coding: utf-8 _*_
# _*_ author: fxzengfrank _*_
#
import os, time
import logging, traceback
from threading import Thread
from module import xlog, xconfig, server
#
class xapp():
    #
    def __init__(self):
        self.main_dir = os.path.dirname(os.path.abspath(__file__))
        self.module_dir = os.path.join(self.main_dir, 'module')
        self.log_file = os.path.join(self.main_dir, 'log', 'xpack.log')
        self.conf_file = os.path.join(self.main_dir, 'conf', 'xpack.conf')
        #
        xlog.init(self.log_file)
        xlog.setlevel(xlog.DEBUG)
        #
        self.conf = xconfig.xconfig(self.conf_file)
        self.server = server.WebServer(self)
        #
        self.server.run_forever()
#
if __name__ == '__main__':
    app = xapp()
    