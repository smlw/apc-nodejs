function RegisterApp() {
    function randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    var appObject = {
        secretKey: randomString(16),
        domainName: '',
        checkRights: false,
        DBData: {
            user: '',
            password: '',
            port: '',
            tableName: '',
            DBtype: ''
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
    this.setDBData = function (user, password, port, tableName, DBtype) {
        appObject.DBData.user = user;
        appObject.DBData.password = password;
        appObject.DBData.port = port;
        appObject.DBData.tableName = tableName;
        appObject.DBData.DBtype = DBtype;
        return true;
    };

    // GETTERS
    this.getAppObject = function () {
        return appObject;
    };

};
