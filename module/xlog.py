#!/usr/bin/env python
# _*_ coding: utf-8 _*_
# _*_ author: fxzengfrank _*_
#
import os, sys
import logging, logging.handlers
#
DEBUG = logging.DEBUG
INFO = logging.INFO
WARNING = logging.WARNING
ERROR = logging.ERROR
CRITICAL = logging.CRITICAL

def init(logfile_path):
    try:
        if _xlog.xlog_obj != None:
            del(_xlog.xlog_obj)
        _xlog.xlog_obj = _xlog(logfile_path)
        return True
    except:
        return False

def getlogger():
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    return _xlog.xlog_obj._logger

def setlevel(level):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    if level in (DEBUG, INFO, WARNING, ERROR, CRITICAL):
        _xlog.xlog_obj.setlevel(level)
        return True
    else:
        return False

def debug(message):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    _xlog.xlog_obj.debug(message)

def info(message):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    _xlog.xlog_obj.info(message)

def warning(message):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    _xlog.xlog_obj.warning(message)

def error(message):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    _xlog.xlog_obj.error(message)

def exception(message):
    if _xlog.xlog_obj is None:
        raise Exception("Should init() first.")
    _xlog.xlog_obj.exception(message)

def _safe_unicode(s):
    try:
        # return _unicode(s)
        return unicode(s)
    except UnicodeDecodeError:
        return repr(s)

class xlogFormatter(logging.Formatter):
    DEFAULT_FORMAT = '%(color)s[%(levelname)1.1s %(asctime)s %(module)s:%(lineno)d]%(end_color)s %(message)s'
    DEFAULT_DATE_FORMAT = '%y%m%d %H:%M:%S'
    DEFAULT_COLORS = {
        logging.DEBUG: 4,   # Blue
        logging.INFO: 2,    # Green
        logging.WARNING: 3, # Yellow
        logging.ERROR: 1,   # Red
    }

    def __init__(self, fmt=DEFAULT_FORMAT, datefmt=DEFAULT_DATE_FORMAT, color=True, colors=DEFAULT_COLORS):
        logging.Formatter.__init__(self, datefmt=datefmt)
        self._fmt = fmt
        self._colors = {}
        if color is True:
            for levelno, code in colors.items():
                self._colors[levelno] = '\033[2;3%dm' % code
                self._normal = '\033[0m'
        else:
            self._normal = ''

    def format(self, record):
        message = record.getMessage()
        record.message = _safe_unicode(message)
        record.asctime = self.formatTime(record, self.datefmt)
        if record.levelno in self._colors:
            record.color = self._colors[record.levelno]
            record.end_color = self._normal
        else:
            record.color = record.end_color = ''
        formatted = self._fmt % record.__dict__
        if record.exc_info:
            if not record.exc_text:
                record.exc_text = self.formatException(record.exc_info)
        if record.exc_text:
            lines = [formatted.rstrip()]
            lines.extend(_safe_unicode(ln) for ln in record.exc_text.split('\n'))
            formatted = '\n'.join(lines)
        return formatted.replace("\n", "\n    ")

class _xlog():
    #
    xlog_obj = None
    #
    _logger = None
    #
    def __init__(self, logfile_path):
        log_dir = os.path.dirname(logfile_path)
        if not os.path.exists(log_dir):
            os.mkdir(log_dir)
        logger = logging.getLogger("xlog")
        logger.propagate = False
        # logger.setLevel(logging.INFO)
        logger.setLevel(logging.DEBUG)
        # fmt = '%(asctime)s-%(levelname)s-%(module)s.%(funcName)s.%(lineno)d: %(message)s'
        fmt = '%(asctime)s %(levelname)s: %(message)s'
        datefmt = '%Y-%m-%d %H:%M:%S'
        color_formatter = xlogFormatter(color=True)
        self.console_hdl = logging.StreamHandler(stream=sys.stdout)
        self.console_hdl.setFormatter(color_formatter)
        normal_formatter = xlogFormatter(color=False)
        self.logfile_hdl = logging.handlers.RotatingFileHandler(filename=logfile_path, maxBytes=10000000, backupCount=5, encoding='utf-8')
        self.logfile_hdl.setFormatter(normal_formatter)
        logger.addHandler(self.console_hdl)
        logger.addHandler(self.logfile_hdl)
        self._logger = logger
    #
    def __del__(self):
        del self._logger
    #
    def setlevel(self, level):
        self._logger.setLevel(level)
        self.console_hdl.setLevel(level)
        self.logfile_hdl.setLevel(level)
    #
    def debug(self, message):
        self._logger.debug(message)
    #
    def info(self, message):
        self._logger.info(message)
    #
    def warning(self, message):
        self._logger.warning(message)
    #
    def error(self, message):
        self._logger.error(message)
    #
    def exception(self, message):
        self._logger.exception(message)
    #