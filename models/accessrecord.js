const db=require('../util/database');

module.exports=class accessRecord{
    constructor(email,mobile,reason)
    {
        this.email=email;
        this.mobile=mobile;
        this.reason=reason;
    }
    save()
    {
        return db.execute('INSERT INTO accessrecord (email,mobile,reason) VALUES (?,?,?)',[this.email,this.mobile,this.reason]);
    }
    static getHistory(email)
    {
        return db.execute('SELECT * FROM accessrecord WHERE email=(?)',[this.email]);
    }
    static getHistoryUser(mobile)
    {
        return db.execute('SELECT * FROM accessrecord WHERE mobile=(?)',[this.mobile]);
    }
    //below 2 methods are to be used in android application end to get and set action to the request made for accessing health records
    static sentNotification(mobile,id,action){
        return db.execute('UPDATE accessrecord SET reason=(?) WHERE id IN (SELECT id FROM accessrecord WHERE id=(?) AND mobile=(?)',[action,id,mobile]);
    }
    static getNotification(mobile,reason){
        return db.execute('SELECT * FROM accessrecord WHERE mobile=(?) AND reason=(?)',[mobile,reason]);
    }
// below methods are for the server end
    static checkState(email,mobile,reason){
        return db.execute('SELECT * FROM accessrecord WHERE mobile=(?) AND email=(?) AND NOT reason=(?)',[mobile,email,reason]);
    }
    static seenRecord(email,reason,action,mobile){
        return db.execute('UPDATE accessrecord SET reason=(?) WHERE id IN (SELECT id FROM accessrecord WHERE NOT reason=(?) AND email=(?) AND mobile=(?)',[action,reason,email,mobile]);
    }
}