const db=require('../util/database');

module.exports=class bulkEmergency{
    constructor(caller,called,status)
    {
        this.called=called;
        this.caller=caller;
        this.status=status;
    }
    save()
    {
        return db.execute('INSERT INTO bulkemergency (caller,called,status) VALUES (?,?,?)',[this.caller,this.called,this.status]);
    }
    static getMyAlarms(called){
        return db.execute('SELECT * FROM bulkemergency WHERE called=(?) AND status = 0',[called]);
    }
    static changeStatus(called,status,caller){
        return db.execute('UPDATE bulkemergency SET status=(?) WHERE called=(?) AND caller=(?)',[status,called,caller]);
    }
    static checkExistence(called){
        return db.execute('SELECT COUNT(id) AS num FROM bulkemergency WHERE called=(?)',[called]);
    }
}