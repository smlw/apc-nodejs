var App = (function () {
    function randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    var appObject = {
        secretKey: randomString(16),
        domainName: null,
        checkRights: null,
        DBData: {
            host: null,
            user: null,
            password: null,
            port: null,
            tableName: null,
            DBtype: null,
            cols: {
                user_id: null,
                user_password: null,
                user_email: null,
                user_phone: null,
            }
        }
    };

    var setDomainName = function (domainLink) {
        appObject.domainName = domainLink;
        return true
    };

    var setRights = function () {
        appObject.checkRights = true;
        return true;
    };
    var setDBData = function (host, database, user, password, port, tableName, DBtype) {
        appObject.DBData.host = host;
        appObject.DBData.database = database;
        appObject.DBData.user = user;
        appObject.DBData.password = password;
        appObject.DBData.port = port;
        appObject.DBData.tableName = tableName;
        appObject.DBData.DBtype = DBtype;
        return true;
    };
    
    var setDBcol = function(user_id, user_password, user_email, user_phone){
        appObject.DBData.cols.user_id = user_id;
        appObject.DBData.cols.user_password = user_password;
        appObject.DBData.cols.user_email = user_email;
        appObject.DBData.cols.user_phone = user_phone;
        return true;
    }

    var getAppObject = function () {
        return appObject;
    };

    return {
        setDomainName: setDomainName,
        setRights: setRights,
        setDBData: setDBData,
        setDBcol: setDBcol,
        getAppObject: getAppObject
    }
}())