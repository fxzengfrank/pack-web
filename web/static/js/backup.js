function prepare_vue() {
    Vue.config.silent = true;
    Vue.config.devtools = false;

    var adminSession = Vue.extend({
        template: "#admin-session",
        mounted: function() {
            this.load_data();
        },
        data: function() {
            return {
                filterString: '',
                tableData: [],
                multipleSelection: [],
            };
        },
        computed: {
            filtedTableData: function() {
                var filterString = this.filterString.trim();
                return this.tableData.filter(function(item) {
                    if (filterString == '') {
                        return true;
                    }
                    var index1 = item.userid.indexOf(filterString);
                    var index2 = item.remote_ip.indexOf(filterString);
                    if (index1 >= 0 || index2 >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
        },
        methods: {
            userinfo_formatter: function(row, column) {
                return row.name + ' [ ' + row.userid + ' ]';
            },
            load_data: function() {
                var self = this;
                var tableData = new Array();
                self.tableData = tableData;
                $.getJSON("/api/session", function(data) {
                    for (key in data) {
                        tableData.push(data[key]);
                    }
                    self.tableData = tableData;
                });
            },
            handleSelectionChange: function(val) {
                this.multipleSelection = val;
            },
            refresh_session: function() {
                this.load_data();
                this.$message('刷新完毕');
            },
            clear_session: function() {
                var self = this;
                var sessionidList = new Array();
                for (index in this.multipleSelection) {
                    sessionid = this.multipleSelection[index].session_id
                    sessionidList.push(sessionid);
                }
                var requestData = new Array();
                requestData.data = sessionidList;
                $.ajax({
                    type: 'DELETE',
                    url: "/api/session",
                    data: JSON.stringify(sessionidList),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        self.$message("会话清理完毕");
                        self.load_data();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("会话清理失败");
                        self.load_data();
                    },
                });
            },
        },
    });

    var adminRole = Vue.extend({
        template: "#admin-role",
        mounted: function() {
            this.load_data();
        },
        data: function() {
            return {
                filterString: '',
                tableData: [],
                dialogVisible: false,
                formTitle: '',
                formKeyReadonly: true,
                formMethod: '',
                formData: {
                    roleid: '',
                    name: '',
                    desc: '',
                },
            };
        },
        computed: {
            filtedTableData: function() {
                var filterString = this.filterString.trim();
                return this.tableData.filter(function(row) {
                    if (filterString == '') {
                        return true;
                    }
                    var index1 = row.roleid.indexOf(filterString);
                    var index2 = row.name.indexOf(filterString);
                    if (index1 >= 0 || index2 >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
        },
        methods: {
            load_data: function() {
                var self = this;
                var tableData = new Array();
                self.tableData = tableData;
                $.getJSON("/api/role", function(data) {
                    for (key in data) {
                        tableData.push(data[key]);
                    }
                    self.tableData = tableData;
                });
            },
            handleRefresh: function() {
                this.load_data();
                this.$message('刷新完毕');
            },
            handleAdd: function() {
                this.formTitle = '新增权限角色';
                this.formKeyReadonly = false;
                this.formMethod = 'insert';
                this.dialogVisible = true;
            },
            handleEdit: function(index, row) {
                this.formTitle = '编辑权限角色';
                this.formKeyReadonly = true;
                this.formMethod = 'update';
                this.formData.roleid = row.roleid;
                this.formData.name = row.name;
                this.formData.desc = row.desc;
                this.dialogVisible = true;
            },
            handleConfirm: function() {
                var self = this;
                if (self.formMethod == 'insert') {
                    $.ajax({
                        type: 'POST',
                        url: "/api/role",
                        data: JSON.stringify(self.formData),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                } else if (self.formMethod == 'update') {
                    $.ajax({
                        type: 'PUT',
                        url: "/api/role",
                        data: JSON.stringify(self.formData),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                }
            },
            handleDelete: function(index, row) {
                var self = this;
                var role_date = {
                    roleid: row.roleid,
                };
                $.ajax({
                    type: 'DELETE',
                    url: "/api/role",
                    data: JSON.stringify(role_date),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
        },
    });

    var adminGroup = Vue.extend({
        template: "#admin-group",
        mounted: function() {
            this.load_data();
        },
        data: function() {
            return {
                group_dict: {},
                user_dict: {},
                role_dict: {},
                filterString: '',
                tableData: [],
                dialogVisible: false,
                formTitle: '',
                formKeyReadonly: true,
                formMethod: '',
                formData: {
                    groupid: '',
                    name: '',
                    desc: '',
                    rolelist: [],
                    userlist: [],
                },
                dialogRoleTitle: '',
                dialogRoleGroupID: '',
                dialogRoleVisible: false,
                dialogRoleValue: [],
                dialogRoleData: [],
                dialogUserTitle: '分配用户',
                dialogUserGroupID: '',
                dialogUserVisible: false,
                dialogUserValue: [],
                dialogUserData: [],
            };
        },
        computed: {
            filtedTableData: function() {
                var filterString = this.filterString.trim();
                return this.tableData.filter(function(row) {
                    if (filterString == '') {
                        return true;
                    }
                    var index1 = row.groupid.indexOf(filterString);
                    var index2 = row.name.indexOf(filterString);
                    var index3 = row.desc.indexOf(filterString);
                    if (index1 >= 0 || index2 >= 0 || index3 >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
        },
        methods: {
            load_data: function() {
                var self = this;
                var tableData = new Array();
                self.tableData = tableData;
                $.getJSON("/api/group", function(data) {
                    // console.log(data);
                    self.group_dict = data['group_dict'];
                    self.user_dict = data['user_dict'];
                    self.role_dict = data['role_dict'];
                    for (key in self.group_dict) {
                        tableData.push(self.group_dict[key]);
                    }
                    self.tableData = tableData;
                });
            },
            handleRefresh: function() {
                this.load_data();
                this.$message('刷新完毕');
            },
            handleAdd: function() {
                this.formTitle = '新增用户组';
                this.formKeyReadonly = false;
                this.formMethod = 'insert';
                this.formData.groupid = '';
                this.formData.name = '';
                this.formData.desc = '';
                this.dialogVisible = true;
            },
            handleEdit: function(index, row) {
                this.formTitle = '编辑用户组';
                this.formKeyReadonly = true;
                this.formMethod = 'update';
                this.formData.groupid = row.groupid;
                this.formData.name = row.name;
                this.formData.desc = row.desc;
                this.dialogVisible = true;
            },
            handleConfirm: function(index, row) {
                var self = this;
                if (self.formMethod == 'insert') {
                    $.ajax({
                        type: 'POST',
                        url: "/api/group",
                        data: JSON.stringify(self.formData),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                } else if (self.formMethod == 'update') {
                    var update_data = {
                        'action': 'update_group',
                        'form_data': self.formData,
                    };
                    $.ajax({
                        type: 'PUT',
                        url: "/api/group",
                        data: JSON.stringify(update_data),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                }

            },
            handleDelete: function(index, row) {
                var self = this;
                var g_data = {
                    groupid: row.groupid,
                };
                $.ajax({
                    type: 'DELETE',
                    url: "/api/group",
                    data: JSON.stringify(g_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
            handleGroupRole: function(index, row) {
                var self = this;
                self.dialogRoleTitle = '分配角色：' + row.groupid + ' [' + row.name + ' ]';
                self.dialogRoleGroupID = row.groupid;
                self.dialogRoleValue = row.rolelist;
                self.dialogRoleData = [];
                for (k in self.role_dict) {
                    self.dialogRoleData.push({
                        key: k,
                        label: self.role_dict[k],
                    });
                };
                self.dialogRoleVisible = true;
            },
            handleGroupUser: function(index, row) {
                var self = this;
                self.dialogUserTitle = '分配用户：' + row.groupid + ' [' + row.name + ' ]';
                self.dialogUserGroupID = row.groupid;
                self.dialogUserValue = row.userlist;
                self.dialogUserData = [];
                for (k in self.user_dict) {
                    self.dialogUserData.push({
                        key: k,
                        label: self.user_dict[k],
                    });
                };
                self.dialogUserVisible = true;
            },
            handleDialogRoleConfirm: function() {
                var self = this;
                var update_data = {
                    'action': 'update_role',
                    'groupid': self.dialogRoleGroupID,
                    'role_list': self.dialogRoleValue,
                };
                $.ajax({
                    type: 'PUT',
                    url: "/api/group",
                    data: JSON.stringify(update_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                        self.$message(result["message"]);
                        if (result["result"]) {
                            self.dialogRoleVisible = false;
                            self.load_data();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
            handleDialogUserConfirm: function() {
                var self = this;
                var update_data = {
                    'action': 'update_user',
                    'groupid': self.dialogUserGroupID,
                    'user_list': self.dialogUserValue,
                };
                $.ajax({
                    type: 'PUT',
                    url: "/api/group",
                    data: JSON.stringify(update_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                        self.$message(result["message"]);
                        if (result["result"]) {
                            self.dialogUserVisible = false;
                            self.load_data();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
        },
    });

    var adminLocalUser = Vue.extend({
        template: "#admin-local-user",
        mounted: function() {
            this.load_data();
        },
        data: function() {
            return {
                filterString: '',
                tableData: [],
                dialogVisible: false,
                formTitle: '',
                formKeyReadonly: true,
                formMethod: '',
                formData: {
                    userid: '',
                    name: '',
                    company: '',
                    mail: '',
                    disabled: false,
                    expiredate: '',
                },
                dialogPasswordVisible: false,
                formPasswordData: {
                    userid: '',
                    name: '',
                    password1: '',
                    password2: '',
                },
            };
        },
        computed: {
            filtedTableData: function() {
                var filterString = this.filterString.trim();
                return this.tableData.filter(function(row) {
                    if (filterString == '') {
                        return true;
                    }
                    var index1 = row.userid.indexOf(filterString);
                    var index2 = row.name.indexOf(filterString);
                    var index3 = row.company.indexOf(filterString);
                    var index4 = row.mail.indexOf(filterString);
                    if (index1 >= 0 || index2 >= 0 || index3 >= 0 || index4 >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
        },
        methods: {
            load_data: function() {
                var self = this;
                var tableData = new Array();
                self.tableData = tableData;
                $.getJSON("/api/user/local", function(data) {
                    for (key in data) {
                        tableData.push(data[key]);
                    }
                    self.tableData = tableData;
                });
            },
            handleRefresh: function() {
                this.load_data();
                this.$message('刷新完毕');
            },
            handleAdd: function() {
                this.formTitle = '新增本地用户';
                this.formKeyReadonly = false;
                this.formMethod = 'insert';
                this.formData.userid = '';
                this.formData.name = '';
                this.formData.disabled = false;
                this.dialogVisible = true;
            },
            handleEdit: function(index, row) {
                this.formTitle = '编辑本地用户';
                this.formKeyReadonly = true;
                this.formMethod = 'update';
                this.formData.userid = row.userid;
                this.formData.name = row.name;
                this.formData.company = row.company;
                this.formData.mail = row.mail;
                this.formData.disabled = row.disabled;
                this.formData.expiredate = row.expiredate;
                this.dialogVisible = true;
            },
            handleConfirm: function(index, row) {
                var self = this;
                if (self.formMethod == 'insert') {
                    $.ajax({
                        type: 'POST',
                        url: "/api/user/local",
                        data: JSON.stringify(self.formData),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                } else if (self.formMethod == 'update') {
                    $.ajax({
                        type: 'PUT',
                        url: "/api/user/local",
                        data: JSON.stringify(self.formData),
                        timeout: 1000,
                        success: function(data, textStatus, jqXHR) {
                            var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            self.$message("提交失败");
                        },
                    });
                }
            },
            handleDelete: function(index, row) {
                var self = this;
                var user_data = {
                    userid: row.userid,
                };
                $.ajax({
                    type: 'DELETE',
                    url: "/api/user/local",
                    data: JSON.stringify(user_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
            disabled_formatter: function(row, column) {
                if (row.disabled == true) {
                    return "禁用";
                } else {
                    return "启用";
                }
            },
            handlePassword: function(index, row) {
                this.formPasswordData.userid = row.userid;
                this.formPasswordData.name = row.name;
                this.formPasswordData.password1 = '';
                this.formPasswordData.password2 = '';
                this.dialogPasswordVisible = true;
            },
            handlePasswordCancel: function() {
                this.formPasswordData.userid = '';
                this.formPasswordData.name = '';
                this.formPasswordData.password1 = '';
                this.formPasswordData.password2 = '';
                this.dialogPasswordVisible = false;
            },
            handlePasswordConfirm: function() {
                var self = this;
                var password1 = this.formPasswordData.password1.trim();
                var password2 = this.formPasswordData.password2.trim();
                if (password1 != password2) {
                    self.$message("两遍密码需一致");
                    return false;
                } else if (password1 == '') {
                    self.$message("密码为空");
                    return false;
                }
                var p_data = {
                    userid: this.formPasswordData.userid,
                    passwd: password1,
                }
                $.ajax({
                    type: 'PUT',
                    url: "/api/user/local",
                    data: JSON.stringify(p_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                        self.$message(result["message"]);
                        if (result["result"]) {
                            self.dialogVisible = false;
                            self.load_data();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
        },
    });

    var adminAamUser = Vue.extend({
        template: "#admin-aam-user",
        mounted: function() {
            this.load_data();
        },
        data: function() {
            return {
                filterString: '',
                tableData: [],
            };
        },
        computed: {
            filtedTableData: function() {
                var filterString = this.filterString.trim();
                return this.tableData.filter(function(row) {
                    if (filterString == '') {
                        return true;
                    }
                    var index1 = row.userid.indexOf(filterString);
                    var index2 = row.name.indexOf(filterString);
                    var index3 = row.branchname.indexOf(filterString);
                    var index4 = row.notes.indexOf(filterString);
                    if (index1 >= 0 || index2 >= 0 || index3 >= 0 || index4 >= 0) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
        },
        methods: {
            load_data: function() {
                var self = this;
                var tableData = new Array();
                self.tableData = tableData;
                $.getJSON("/api/user/aam", function(data) {
                    for (key in data) {
                        tableData.push(data[key]);
                    }
                    self.tableData = tableData;
                });
            },
            handleRefresh: function() {
                this.load_data();
                this.$message('刷新完毕');
            },
            handleEdit: function(index, row) {
                var self = this;
                var user_data = {
                    userid: row.userid,
                    disabled: !row.disabled,
                };
                $.ajax({
                    type: 'PUT',
                    url: "/api/user/aam",
                    data: JSON.stringify(user_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                        self.$message(result["message"]);
                        if (result["result"]) {
                            self.dialogVisible = false;
                            self.load_data();
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
            handleDelete: function(index, row) {
                var self = this;
                var user_data = {
                    userid: row.userid,
                };
                $.ajax({
                    type: 'DELETE',
                    url: "/api/user/aam",
                    data: JSON.stringify(user_data),
                    timeout: 1000,
                    success: function(data, textStatus, jqXHR) {
                        var result = JSON.parse(data)
                            self.$message(result["message"]);
                            if (result["result"]) {
                                self.dialogVisible = false;
                                self.load_data();
                            }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        self.$message("提交失败");
                    },
                });
            },
            disabled_formatter: function(row, column) {
                if (row.disabled == true) {
                    return "禁用";
                } else {
                    return "启用";
                }
            },
        },
    });

    var adminOperation = Vue.extend({
        template: "#admin-operation",
        data: function() {
            return {
                disable_load_dataset: false,
                disable_dump_dataset: false,
            };
        },
        methods: {
            load_dataset: function() {
                var self = this;
                self.disable_load_dataset = true;
                $.get("/api/db/reload", function(data) {
                    self.$message("数据集加载完毕");
                    self.disable_load_dataset = false;
                });
            },
            dump_dataset: function() {
                var self = this;
                self.disable_dump_dataset = true;
                $.get("/api/db/flush", function(data) {
                    self.$message("数据集转储完毕");
                    self.disable_dump_dataset = false;
                });
            },
        },
    });

    var app = new Vue({
        el: "#app",
        components: {
            'admin-session': adminSession,
            'admin-role': adminRole,
            'admin-group': adminGroup,
            'admin-local-user': adminLocalUser,
            'admin-aam-user': adminAamUser,
            'admin-operation': adminOperation,
        },
        data: function() {
            return {
                activeIndex: "session",
                myComp: "admin-session",
                tableData: null,
            };
        },
        methods: {
            handleSelect: function(key, keyPath) {
                this.activeIndex = key
                if (key=="session") {
                    this.myComp = 'admin-session';
                } else if (key=="aam_user") {
                    this.myComp = 'admin-aam-user';
                } else if (key=="local_user") {
                    this.myComp = 'admin-local-user';
                } else if (key=="group") {
                    this.myComp = 'admin-group';
                } else if (key=="role") {
                    this.myComp = 'admin-role';
                } else if (key=="operation") {
                    this.myComp = 'admin-operation';
                }
            },
        },
    });
}

$(document).ready(function() {
    prepare_vue();
});
