
var router = new VueRouter({
    mode: 'history',
    routes: []
});

const app = new Vue({

    router,
    el: '#app',
    data: {
        //WebApiUrl: 'https://localhost:44342/api/DINDONC',
        WebApiUrl: 'https://peterxie.azurewebsites.net/api/DINDONC',
        rdoMemType: 'Master',
        M_Name: null,
        M_Password: null,
        errors: [],
        map: null,
        tableDataOfGroup: [],
        tableData: [],
        DetailVisibleFlag: false,
        editGroupVisibleFlag: false,
        activeName: 'third',
        TblDetail: [],
        JGroupName: null,
        JLeaderName: null,
        JDateRnage: null,
        JDescription: null,
        editGroupForm: {
            ID: null,
            GroupName: null,
            Description: null,
            StartTime: null,
            EndTime: null,
            LeaderName: null,
            LeaderPassword: null,
            dateTimeRange: null
        },
        myFormGroup: {
            ID: null,
            GroupName: null,
            Description: null,
            StartTime: null,
            EndTime: null,
            LeaderName: null,
            LeaderPassword: null,
            dateTimeRange: null
        },
        CheckGroupStatus: false,
        SecondPageGroup: {
            GID: null,
            ItemName: null,
            Count: 1,
            MemberName: null,
            Description: null,
            MemberPassword: null
        },
        ViewGroupDetailData: {
            ID: null,
            GroupName: null,
            Description: null,
            StartTime: null,
            EndTime: null,
            LeaderName: null,
            LeaderPassword: null,
            dateTimeRange: null
        },
        LodingFlag: false,
        defaultDateFrom: new Date(),
        defaultDateTo: "2020-08-18",
        rules: {
            ID: [{
                required: true,
                message: '請輸入ID',
                trigger: 'blur'
            }
            ],
            GroupName: [{
                required: true,
                message: '請輸入團名',
                trigger: 'blur'
            }, {
                min: 2,
                max: 20,
                message: '場館名稱必須是2-20個字',
                trigger: 'change'
            }
            ],
            Description: [{
                required: true,
                message: '請輸入揪團說明',
                trigger: 'blur'
            }
            ],
            StartTime: [{
                required: true,
                message: '請輸入接單時間',
                trigger: 'blur'
            }
            ],
            EndTime: [{
                required: true,
                message: '請輸入結單時間',
                trigger: 'blur'
            }
            ],
            LeaderName: [{
                required: true,
                message: '請輸入團主名稱',
                trigger: 'blur'
            }
            ],
            LeaderPassword: [{
                required: true,
                message: '請輸入密碼',
                trigger: 'blur'
            }, {
                min: 2,
                message: '密碼必須大於2個字元',
                trigger: 'change'
            }
            ],
            Password: [{
                required: true,
                message: '請輸入密碼',
                trigger: 'blur'
            }, {
                min: 2,
                message: '密碼必須大於2個字元',
                trigger: 'change'
            }
            ],
            MemberName: [{
                required: true,
                message: '請輸入取貨人',
                trigger: 'blur'
            }
            ],
            ItemName: [{
                required: true,
                message: '請輸入商品',
                trigger: 'blur'
            }
            ],
            checkPass: [{
                required: true,
                message: '请再次输入密码',
                trigger: 'blur'
            }, {
                validator: this.validatePass,
                trigger: 'change'
            }
            ],
            dateTimeRange: [{
                required: true,
                message: '請選擇期間',
                trigger: 'blur'
            }
            ]
        },
        ruleForm: {
            pass: '',
            checkPass: '',
        },
        validatePass(rule, value, callback) {
            if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        },
        StartTimeOptions: {
            disabledDate(date) {
                return date <= new Date(new Date().setDate(new Date().getDate() - 1));
            }
        },
        EndTimeOptions: {
            disabledDate(date) {
                return date <= new Date(new Date(app.myFormGroup).setDate(new Date(app.myFormGroup).getDate() - 1));
            }
        },
        EditStartTimeOptions: {
            disabledDate(date) {
                return date <= new Date(new Date().setDate(new Date().getDate() - 1));
            }
        },
        EditEndTimeOptions: {
            disabledDate(date) {
                return date <= new Date(new Date(app.editGroupForm).setDate(new Date(app.editGroupForm).getDate() - 1));
            }
        },
        startDatePicker: {
            StartDate: function () {
                const self = this;
                return {
                    disabledDate(time) {
                        if (self.form.projectEndDate) {
                            //如果结束时间不为空，则小于结束时间
                            return (
                                new Date(self.form.projectEndDate).getTime() < time.getTime());
                        } else {
                            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                        }
                    }
                };
            }

        },
        endDatePicker: {
            EndDate: function () {
                const self = this;
                return {
                    disabledDate(time) {
                        if (self.form.projectStartDate) {
                            //如果开始时间不为空，则结束时间大于开始时间
                            return (
                                new Date(self.form.projectStartDate).getTime() > time.getTime());
                        } else {
                            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                        }
                    }
                };
            }

        },
        Camestroyed: false,
        result: '',
        error: '',
        CameraDialogFlag: false,
        lll: false

    },
    methods: {
        Dateformatter(row, column) {
            var FDate = new Date(row.updateDate);
            return FDate.getFullYear() + "-" + (FDate.getMonth() + 1) + "-" + FDate.getDate();
        },
        ChangeDateTimeRange(tt) {
            this.myFormGroup.StartTime = tt[0];
            this.myFormGroup.EndTime = tt[1];
            console.log(tt);

        },
        ChangeEditDateTimeRange(tt) {
            this.editGroupForm.StartTime = tt[0];
            this.editGroupForm.EndTime = tt[1];

            console.log(tt);

        },
        GetGUID() {
            return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toUpperCase();;
        },
        S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        OptionNewGroup: function () {
            this.LodingFlag = true;
            app.myFormGroup.ID = this.GetGUID();

            fetch(this.WebApiUrl, {
                method: 'POST',
                credentials: 'same-origin', // include, same-origin, *omit
                // headers 加入 json 格式
                headers: {
                    'Content-Type': 'application/json'
                },
                // body 將 json 轉字串送出
                body: JSON.stringify(app.myFormGroup)
            }).then((response) => {
                if (response.status == 201) {
                    //alert("建立成功!");
                }
                return response.json();
            }).then((jsonData) => {
                const h = this.$createElement;
                var ele = h('div', [h('p', '團名:'),
                h('p', '趕快把連結給你的團員吧~'),
                h('div', {
                    attrs: {
                        id: 'placeHolder'
                    },
                    domProps: {
                        innerHTML: 'QRCODE產生中..'
                    },
                    style: {
                        'text-align': '-webkit-center'
                    }
                })]);

                this.$msgbox({
                    title: '消息',
                    message: ele,
                    showCancelButton: false,
                    confirmButtonText: '確定',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '讀取中...';
                            setTimeout(() => {
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 3000);
                        } else {
                            done();
                        }
                    }
                }).then(action => {
                    this.$message({
                        type: 'info',
                        message: 'action: ' + action
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                }).finally(() => {
                    this.LodingFlag = false;
                });

                var timeout = setTimeout(() => {
                    //QRCODE產生
                    var typeNumber = 0;
                    var errorCorrectionLevel = 'M';
                    var qr = qrcode(typeNumber, errorCorrectionLevel);
                    qr.addData(location.href + '?method=qrcode&value=' + jsonData.id);
                    qr.make();
                    document.getElementById('placeHolder').innerHTML = qr.createImgTag();
                }, 1000);

            }).catch((err) => {
                console.log('錯誤:', err);
                var Content = '發生錯誤![' + err + ']請聯絡系統管理員';
                this.$alert(Content, '開團失敗', {
                    confirmButtonText: '確定'
                });
            }).finally(() => {
                this.LodingFlag = false;
            });
        },
        CheckNewGroup: function (e) {
            this.$refs["myFormGroup"].validate((vaild) => {
                if (vaild) {
                    this.OptionNewGroup();
                } else {
                    app.$notify.error({
                        title: '錯誤',
                        message: '請確認必填欄位都已填寫!',
                        position: 'bottom-right'
                    });
                }
            })

        },
        CheckSecondGroup: function (e) {

            this.$refs["SecondPageGroup"].validate((vaild) => {
                if (vaild) {
                    this.NewDinRequest();
                } else {
                    app.$notify.error({
                        title: '錯誤',
                        message: '請確認必填欄位都已填寫!',
                        position: 'bottom-right'
                    });
                }

            })
        },
        NewDinRequest: function () {
            this.LodingFlag = true;
            fetch(this.WebApiUrl + '/member', {
                method: 'POST',
                credentials: 'same-origin', // include, same-origin, *omit
                // headers 加入 json 格式
                headers: {
                    'Content-Type': 'application/json'
                },
                // body 將 json 轉字串送出
                body: JSON.stringify(app.SecondPageGroup)
            }).then((response) => {
                if (response.status == 201) {
                    //alert("建立成功!");
                }
                return response.json();
            }).then((jsonData) => {
                console.log(jsonData);

                this.$alert('YA', '加入成功!', {
                    confirmButtonText: '確定',
                    callback: action => {
                        this.$refs.SecondPageGroup.resetFields();
                    }
                });
            }).catch((err) => {
                console.log('錯誤:', err);
            }).finally(() => this.LodingFlag = false);
        },
        CheckGID: function () {
            this.LodingFlag = true;
            this.JGroupName = null;
            this.JLeaderName = null;
            this.JDateRnage = null;
            this.JDescription = null;

            fetch(this.WebApiUrl + '/' + this.SecondPageGroup.GID, {
                method: 'GET',
                credentials: 'same-origin', // include, same-origin, *omit
                // headers 加入 json 格式
                headers: {
                    'Content-Type': 'application/json'
                },
                // body 將 json 轉字串送出
            }).then((response) => {
                if (response.status == 200) {
                    this.CheckGroupStatus = true;
                    this.$notify({
                        title: '系統訊息',
                        message: '找到團!',
                        type: 'success'
                    });
                    response.json().then(function (data) {
                        app.JGroupName = data.groupName;
                        app.JLeaderName = data.leaderName;
                        app.JDateRnage = moment(data.startTime).format('YYYY-MM-DD HH:mm') + ' ~ ' + moment(data.endTime).format('YYYY-MM-DD HH:mm');
                        app.JDescription = data.description;

                        console.log(data);
                    });

                } else {
                    this.CheckGroupStatus = false;
                    this.$notify.error({
                        title: '系統訊息',
                        message: '哇嗚!找不到此團!'
                    });
                }
                //return response.json();
            }).catch((err) => {
                this.$notify({
                    title: '系統訊息',
                    message: '系統發生錯誤:' + err,
                    type: 'warning'
                });

            }).finally(() => {
                this.LodingFlag = false;
            });

        },
        SearchUserDetail: function () {
            this.clearTableData();
            if (app.rdoMemType == null)
                return;

            this.LodingFlag = true;
            var PostData = {
                LoginID: this.M_Name,
                Password: this.M_Password
            };

            switch (this.rdoMemType) {
                case "Master":
                    fetch(this.WebApiUrl + '/user', {
                        method: 'POST',
                        credentials: 'same-origin', // include, same-origin, *omit
                        // headers 加入 json 格式
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // body 將 json 轉字串送出
                        body: JSON.stringify(PostData)
                    }).then((response) => {
                        if (response.status == 201) {
                            //alert("建立成功!");
                        }
                        return response.json();
                    }).then((jsonData) => {
                        this.tableDataOfGroup = jsonData;
                        console.log(jsonData)
                    }).catch((err) => {
                        this.$notify({
                            title: '系統訊息',
                            message: '系統發生錯誤:' + err,
                            type: 'warning'
                        });

                    }).finally(() => {
                        this.LodingFlag = false;
                    });
                    break;
                case "Member":
                    fetch(this.WebApiUrl + '/member/user', {
                        mode: 'cors',
                        method: 'POST',
                        credentials: 'same-origin', // include, same-origin, *omit
                        // headers 加入 json 格式
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // body 將 json 轉字串送出
                        body: JSON.stringify(PostData)
                    }).then((response) => {
                        if (response.status == 201) {
                            //alert("建立成功!");
                        }
                        return response.json();
                    }).then((jsonData) => {
                        this.tableData = jsonData;
                        console.log(jsonData)
                    }).catch((err) => {
                        this.$notify({
                            title: '系統訊息',
                            message: '系統發生錯誤:' + err,
                            type: 'warning'
                        });

                    }).finally(() => {
                        this.LodingFlag = false;
                    });
                    break;
            }

        },
        clearTableData(val) {
            console.log(val);
            this.tableData = [];
            this.tableDataOfGroup = [];
        },
        deleteOrder(row) {
            this.$confirm('此操作將永久刪除此訂單, 是否繼續?', '提示', {
                confirmButtonText: '掰',
                cancelButtonText: '考慮一下',
                type: 'warning'
            }).then(() => {
                fetch(this.WebApiUrl + '/member/' + row.id, {
                    method: 'DELETE',
                    credentials: 'same-origin' // include, same-origin, *omit
                }).then((response) => {
                    if (response.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    return response.json();
                }).then((jsonData) => {
                    //刪除資料
                    this.tableData = this.tableData.filter(o => o.id != jsonData.id);
                    console.log(jsonData);
                }).catch((err) => {
                    this.$notify({
                        title: '系統訊息',
                        message: '系統發生錯誤:' + err,
                        type: 'warning'
                    });
                }).finally(() => {
                    this.LodingFlag = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        changeData: function (s) {
            //如果存在ArrayBuffer对象(es6) 最好采用该对象
            if (typeof ArrayBuffer !== 'undefined') {

                //1、创建一个字节长度为s.length的内存区域
                var buf = new ArrayBuffer(s.length);

                //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
                var view = new Uint8Array(buf);

                //3、返回指定位置的字符的Unicode编码
                for (var i = 0; i != s.length; ++i)
                    view[i] = s.charCodeAt(i) & 0xFF;
                return buf;

            } else {
                var buf = new Array(s.length);
                for (var i = 0; i != s.length; ++i)
                    buf[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
        },
        Dateformatter(row, column) {
            var FDate = new Date(row[column.property]);
            return moment(FDate).format('YYYY-MM-DD HH:mm');
        },
        jsonObjToExcel: function (obj, FileName) {
            var xlsxobj = XLSX.utils.json_to_sheet(obj);
            var wopts = {
                bookType: 'xlsx',
                bookSST: false,
                type: 'binary'
            };
            var workBook = {
                SheetNames: ['Sheet1'],
                Sheets: {},
                Props: {}
            };
            workBook.Sheets['Sheet1'] = xlsxobj;

            download(new Blob([this.changeData(XLSX.write(workBook, wopts))], {
                type: 'application/octet-stream'
            }), FileName + '.xlsx')
        },
        viewGroupDetail(row) {
            this.LodingFlag = true;
            //抬頭資料
            var UrlT = this.WebApiUrl + '/' + row.id;

            fetch(UrlT)
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    console.log(myJson);

                    app.ViewGroupDetailData.ID = myJson.id;
                    app.ViewGroupDetailData.GroupName = myJson.groupName;
                    app.ViewGroupDetailData.Description = myJson.description;
                    app.ViewGroupDetailData.StartTime = moment(myJson.startTime).format('YYYY-MM-DD HH:mm:ss');
                    app.ViewGroupDetailData.EndTime = moment(myJson.endTime).format('YYYY-MM-DD HH:mm:ss');
                    app.ViewGroupDetailData.LeaderName = myJson.leaderName;

                    //TODO顯示詳細資料
                    var Url = app.WebApiUrl + '/member/Group/' + row.id;
                    fetch(Url)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (myJson) {
                            for (var i = 0; i < myJson.length; i++) {
                                delete myJson[i].id
                                delete myJson[i].gid;
                                delete myJson[i].memberPassword;
                                myJson[i]["updateDate"] = moment(myJson[i]["updateDate"]).format('YYYY-MM-DD HH:mm:ss');

                            }
                            app.TblDetail = myJson;
                            console.log(myJson);
                            app.DetailVisibleFlag = true;
                        }).finally(() => app.LodingFlag = false);
                });

        },
        downloadDetailExcel() {
            var msg = {};
            var outputJson = [];
            if (app.TblDetail != null && app.TblDetail.length > 0) {
                for (var i = 0; i < app.TblDetail.length; i++) {
                    outputJson.push({
                        'No': (i + 1),
                        '下單者': app.TblDetail[i]['memberName'],
                        '物品名稱': app.TblDetail[i]['itemName'],
                        '數量': app.TblDetail[i]['count'],
                        '更新時間': app.TblDetail[i]['updateDate'],
                    });

                }

                this.jsonObjToExcel(outputJson, "詳細清單");

                msg = {
                    message: '下載成功',
                    type: 'success'
                };
            } else {
                msg = {
                    message: '沒有東西可以下載!',
                    type: 'error'
                };
            }

            app.$message(msg);
        },
        DeleteGroup: function (data) {
            this.$confirm('將刪除所有該揪團與訂購者資料，是否繼續?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.LodingFlag = true;
                console.log("刪除" + data.id);
                //TODO刪除
                fetch(this.WebApiUrl + '/' + data.id, {
                    method: 'DELETE',
                    credentials: 'same-origin', // include, same-origin, *omit
                }).then((response) => {
                    if (response.status == 201) {
                        //alert("建立成功!");
                    }
                    return response.json();
                }).then(jsonData => {
                    console.log(jsonData);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.SearchUserDetail();

                }).finally(() => {
                    this.LodingFlag = false;
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        editGroup: function (data) {
            this.LodingFlag = true;
            console.log(data);

            fetch(this.WebApiUrl + '/' + data.id)
                .then((response) => {
                    if (response.status == 201) {
                        //alert("建立成功!");
                    }
                    return response.json();
                }).then(jsonData => {
                    console.log(jsonData);
                    this.editGroupForm.ID = jsonData.id;
                    this.editGroupForm.GroupName = jsonData.groupName;
                    this.editGroupForm.Description = jsonData.description;
                    this.editGroupForm.dateTimeRange = [jsonData.startTime, jsonData.endTime];
                    this.editGroupForm.StartTime = jsonData.startTime;
                    this.editGroupForm.EndTime = jsonData.endTime;
                    this.editGroupForm.LeaderName = jsonData.leaderName;
                    this.editGroupForm.LeaderPassword = jsonData.leaderPassword;
                    this.editGroupVisibleFlag = true;
                }).finally(() => {
                    this.LodingFlag = false;
                });

        },
        CheckUpdateGroup: function () {
            this.LodingFlag = true;

            //this.editGroupForm.StartTime = moment(this.editGroupForm.StartTime).format('YYYY-MM-DD HH:mm:SS');
            //this.editGroupForm.EndTime = moment(this.editGroupForm.EndTime).format('YYYY-MM-DD HH:mm:SS');
            fetch(this.WebApiUrl + '/' + this.editGroupForm.ID, {
                method: 'PUT',
                credentials: 'same-origin', // include, same-origin, *omit
                // headers 加入 json 格式
                headers: {
                    'Content-Type': 'application/json'
                },
                // body 將 json 轉字串送出
                body: JSON.stringify(this.editGroupForm)
            }).then((response) => {
                if (response.ok) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.$refs.editGroupForm.resetFields();
                    this.editGroupVisibleFlag = false;
                    this.SearchUserDetail();
                } else {
                    this.$message({
                        type: 'success',
                        message: '修改失敗!'
                    });
                }

            }).finally(() => {
                this.LodingFlag = false;
            });
        },
        CopyStringToClipBoard(msg, type) {

            switch (type) {
                case 'URL':
                    msg = window.location.href + '?method=qrcode&value=' + msg;
                    break;
                default:
                    break;
            }
            this.$message({
                message: '複製推薦網址成功，趕快跟你的朋友講吧!',
                type: 'success'
            });
            console.log('ClipBoard : ' + msg);
        },
        DetailVisibleClose() {
            this.ViewGroupDetailData.ID = null;
            this.ViewGroupDetailData.GroupName = null;
            this.ViewGroupDetailData.Description = null;
            this.ViewGroupDetailData.StartTime = null;
            this.ViewGroupDetailData.EndTime = null;
            this.ViewGroupDetailData.LeaderName = null;

        },
        onQRDecode(result) {
            var scanningOK = false;
            this.Camestroyed = true;
            this.CameraDialogFlag = false;
            if (result != null) {
                var attr = result.substr(result.lastIndexOf('?') + 1).split('&');
                if (attr.length == 2) {
                    var attr1 = attr[0].split('=');
                    if (attr1.length == 2 && attr1[0] == 'method' && attr1[1] == 'qrcode') {
                        var attr2 = attr[1].split('=');
                        if (attr2.length == 2 && attr2[0] == 'value') {
                            this.SecondPageGroup.GID = attr2[1];
                            this.CheckGID();
                            scanningOK = true;
                        }

                    }
                }
            }

            if (!scanningOK) {
                this.$message({
                    message: '掃描並非合法格式，請確認!',
                    type: 'info'
                });
            }
        },

        async CameraInit(promise) {
            this.CameraDialogFlag = true;
            this.Camestroyed = false;

            try {
                await promise
            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    this.error = "ERROR: you need to grant camera access permisson"
                } else if (error.name === 'NotFoundError') {
                    this.error = "ERROR: no camera on this device"
                } else if (error.name === 'NotSupportedError') {
                    this.error = "ERROR: secure context required (HTTPS, localhost)"
                } else if (error.name === 'NotReadableError') {
                    this.error = "ERROR: is the camera already in use?"
                } else if (error.name === 'OverconstrainedError') {
                    this.error = "ERROR: installed cameras are not suitable"
                } else if (error.name === 'StreamApiNotSupportedError') {
                    this.error = "ERROR: Stream API is not supported in this browser"
                }
            }
            finally {
                //
            }
        }

    },
    created() {
        window.addEventListener('load', () => {
            var Source = this.$options.router.history.current.query.method;
            var Value = this.$options.router.history.current.query.value;
            if (Source != undefined && Value != undefined) {
                if (Source == 'qrcode') {
                    this.activeName = 'second';
                    this.SecondPageGroup.GID = Value;
                    this.CheckGID();
                } else {
                    this.activeName = 'first';
                }

            }
        });
        //fix JSON.stringify DateTime problem
        Date.prototype.toJSON = function () {
            return moment(this).format();
        }
    }
});
