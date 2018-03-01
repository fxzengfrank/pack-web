#!/usr/bin/env python
# _*_ coding: utf-8 _*_
#
import os
import json
import logging
import traceback
import requests
#
class SSODB():
    #
    def __init__(self, main):
        #
        self.main = main

        self.ssodb_conf = dict( url='https://76.10.175.101:9998/ssodb' )
        self.main.conf.load_conf('ssodb', self.ssodb_conf)
        self.verify = False
        # self.verify = self.main.server.ssl_dir
    #
    def do_test(self):
	try:
	    resp = requests.get(self.ssodb_conf['url'], verify=self.verify)
	    return "%s" % resp.status_code
	except:
	    return "fail"
    #
    def load_dict(self, dict_name):
        try:
            req_data = dict(type='request', command='load_dict')
            req_data['parameter'] = dict(dict_name=dict_name)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'load_dict'
            return resp_data['result']
        except:
            return False
    #
    def list_dict(self, dict_name):
        try:
            req_data = dict(type='request', command='list_dict')
            req_data['parameter'] = dict(dict_name=dict_name)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'list_dict'
            return resp_data['result']
        except:
            return None
    #
    def dump_dict(self, dict_name):
        try:
            req_data = dict(type='request', command='dump_dict')
            req_data['parameter'] = dict(dict_name=dict_name)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'dump_dict'
            return resp_data['result']
        except:
            return None
    #
    def flush_dict(self, dict_name):
        try:
            req_data = dict(type='request', command='flush_dict')
            req_data['parameter'] = dict(dict_name=dict_name)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'flush_dict'
            return resp_data['result']
        except:
            return False
    #
    def select_dict(self, dict_name, dict_id):
        try:
            req_data = dict(type='request', command='select_dict')
            req_data['parameter'] = dict(dict_name=dict_name, dict_id=dict_id)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'select_dict'
            return resp_data['result']
        except:
            return None
    #
    def insert_dict(self, dict_name, dict_id, dict_data):
        try:
            req_data = dict(type='request', command='insert_dict')
            req_data['parameter'] = dict(dict_name=dict_name, dict_id=dict_id, dict_data=dict_data)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'insert_dict'
            return resp_data['result']
        except:
            return False
    #
    def update_dict(self, dict_name, dict_id, dict_data):
        try:
            req_data = dict(type='request', command='update_dict')
            req_data['parameter'] = dict(dict_name=dict_name, dict_id=dict_id, dict_data=dict_data)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'update_dict'
            return resp_data['result']
        except:
            return False
    #
    def delete_dict(self, dict_name, dict_id):
        try:
            req_data = dict(type='request', command='delete_dict')
            req_data['parameter'] = dict(dict_name=dict_name, dict_id=dict_id)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'delete_dict'
            return resp_data['result']
        except:
            return False
    #
    def aam_authenticate(self, userid, passwd):
        try:
            req_data = dict(type='request', command='aam_authenticate')
            req_data['parameter'] = dict(userid=userid, passwd=passwd)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'aam_authenticate'
            return resp_data['result']
        except:
            return False
    #
    def aam_query_info(self, userid):
        try:
            req_data = dict(type='request', command='aam_query_info')
            req_data['parameter'] = dict(userid=userid)
            resp = requests.post(self.ssodb_conf['url'], verify=self.verify, data=json.dumps(req_data))
            assert resp.status_code == 200
            resp_data = json.loads(resp.text)
            assert resp_data['type'] == 'response'
            assert resp_data['command'] == 'aam_query_info'
            return resp_data['result']
        except:
            return False
    #