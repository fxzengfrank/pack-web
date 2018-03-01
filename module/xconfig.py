#! /usr/bin/env python
#! coding:utf-8
#
import os
import ConfigParser
#
class xconfig():
    #
    def __init__(self, fname):
        # self.base_path = os.path.dirname(os.path.abspath(__file__))
        # self.conf_path = os.path.join(self.base_path, fname)
        self.conf_path = fname
        self.conf = ConfigParser.ConfigParser()
        self.conf.read(self.conf_path)
        #
        if os.path.exists(self.conf_path) != True:
            self.write_conf()
        #
    #
    def __del__(self):
        self.write_conf()
    #
    def write_conf(self):
        with open(self.conf_path, 'w') as f:
            self.conf.write(f)
    #
    def load_conf(self, section, conf):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            assert type(conf) is dict
            for k in conf:
                if type(conf[k]) is str:
                    v = self.get_conf(section, k)
                elif type(conf[k]) is bool:
                    v = self.get_conf_bool(section, k)
                elif type(conf[k]) is int:
                    v = self.get_conf_int(section, k)
                elif type(conf[k]) is float:
                    v = self.get_conf_float(section, k)
                else:
                    v = None
                if v != None:
                    conf[k] = v
                else:
                    self.set_conf(section, k, conf[k])
            self.write_conf()
            return conf
        except:
            return None
    #
    def save_conf(self, section, conf):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            assert type(conf) is dict
            for k in conf:
                self.set_conf(section, k, conf[k])
            self.write_conf()
            return True
        except:
            return False
    #
    def get_conf(self, section, option):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            if self.conf.has_option(section, option) is False:
                return None
            value = self.conf.get(section, option)
            assert type(value) is str
            return value
        except:
            return None
    #
    def get_conf_bool(self, section, option):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            if self.conf.has_option(section, option) is False:
                return None
            value = self.conf.getboolean(section, option)
            assert type(value) is bool
            return value
        except:
            return None
    #
    def get_conf_int(self, section, option):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            if self.conf.has_option(section, option) is False:
                return None
            value = self.conf.getint(section, option)
            assert type(value) is int
            return value
        except:
            return None
    #
    def get_conf_float(self, section, option):
        try:
            if self.conf.has_section(section) is False:
                self.conf.add_section(section)
            if self.conf.has_option(section, option) is False:
                return None
            value = self.conf.getfloat(section, option)
            assert type(value) is float
            return value
        except:
            return None
    #
    def set_conf(self, section, option, value):
        if self.conf.has_section(section) is False:
            self.conf.add_section(section)
        self.conf.set(section, option, value)
    #
    def sections(self):
        return self.conf.sections()
    #
    def options(self, section):
        if self.conf.has_section(section) is False:
            return None
        else:
            return self.conf.options(section)
    #
    def del_section(self, section):
        return self.conf.remove_section(section)
    #
    def del_option(self, section, option):
        if self.conf.has_section(section) is False:
            return False
        else:
            return self.conf.remove_option(section, option)
    #
#