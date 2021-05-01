const db=require('../util/database');
module.exports=class User{
    constructor(mobile,name,dob,height,weight,blood,level) {
        this.mobile=mobile;
        this.name=name;
        this.dob=dob;
        this.height=height;
        this.weight=weight;
        this.blood=blood;
        this.level=level;
    }
    save()
    {
        return db.execute('INSERT INTO userbasic (mobile,name,height,weight,dob,blood,level) VALUES (?,?,?,?,?,?,?)',[this.mobile,this.name,this.height,this.weight,this.dob,this.blood,this.level]);
    }
    static getProfile(mobile)
    {
        return db.execute('SELECT * FROM userbasic WHERE mobile=(?)',[mobile]);
    }
    static updateProfile(mobile,name,height,weight,dob,blood)
    {
        return db.execute('UPDATE userbasic SET name=(?),height=(?),weight=(?),dob=(?),blood=(?)WHERE mobile=(?)',[name,height,weight,dob,blood,mobile]);
    }
    static checkNumber(mobile){
        return db.execute('SELECT COUNT(mobile) AS num FROM userbasic WHERE mobile=(?)',[mobile]);
    }
}