function RegisterApp() {
    function randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    var appObject = {
        secretKey: randomString(16),
        domainName: '',
        checkRights: false,
        DBData: {
            host: '',
            user: '',
            password: '',
            port: '',
            tableName: '',
            DBtype: '',
            cols: {
                user_id: '',
                user_password: '',
                user_email: '',
                user_phone: ''
            }
        }
    };

    // SETTERS
    this.setDomainName = function (domainLink) {
        appObject.domainName = domainLink;
        return true
    };
    this.setRights = function () {
        appObject.checkRights = true;
        return true;
    };
    this.setDBData = function (host, user, password, port, tableName, DBtype) {
        appObject.DBData.host = host;
        appObject.DBData.user = user;
        appObject.DBData.password = password;
        appObject.DBData.port = port;
        appObject.DBData.tableName = tableName;
        appObject.DBData.DBtype = DBtype;
        return true;
    };

    this.setDBcol = function(user_id, user_password, user_email, user_phone){
        appObject.DBData.cols.user_id = user_id;
        appObject.DBData.cols.user_password = user_password;
        appObject.DBData.cols.user_email = user_email;
        appObject.DBData.cols.user_phone = user_phone;
        return true;
    }

    // GETTERS
    this.getAppObject = function () {
        return appObject;
    };

};
