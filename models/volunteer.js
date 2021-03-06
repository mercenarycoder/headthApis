const db=require('../util/database');
const { add } = require('./allergy');

module.exports=class volunteer{
    constructor(name,mobile,address,city,pin,enabled,blood,age){
        this.name=name;
        this.mobile=mobile;
        this.city=city;
        this.pin=pin;
        this.address=address;
        this.enabled=enabled;
        this.blood=blood;
        this.age=age;
    }
    save()
    {
        return db.execute('INSERT INTO volunteer(name,mobile,address,city,pincode,enabled,blood,age) VALUES (?,?,?,?,?,?,?,?)',[this.name,this.mobile,this.address,this.city,this.pin,this.enabled,this.blood,this.age]);
    }
    static changeStatus(mobile,enabled){
        return db.execute('UPDATE volunteer SET enabled=(?) WHERE mobile=(?)',[enabled,mobile]);
    }
    static updateVolunteer(city,address,pin,age,blood,mobile){
        return db.execute('UPDATE volunteer SET city=(?),pincode=(?),address=(?),age=(?),blood=(?) WHERE mobile=(?)',[city,pin,address,age,blood,mobile]);
    }
    static getvolunteer(city,pin,blood,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND city=(?) OR pincode=(?) OR blood=(?) ',[city,pin,blood]);
    }
    static getvolunteer2(city,pin,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND city=(?) OR pincode=(?) ',[city,pin]);
    }
    static getDefaultInfo(mobile){
        return db.execute('SELECT * FROM volunteer WHERE mobile=(?)',[mobile]);
    }
    static checkPresence(mobile){
        return db.execute('SELECT COUNT(id) AS num FROM volunteer WHERE mobile=(?)',[mobile]);
    }
    static getVolunteerByCity(city,blood,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND city=(?) OR blood=(?)',[city,blood]);
    }
    static getVolunteerByCity2(city,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND city=(?) ',[city]);
    }
    static getVolunteerByPin(pin,blood,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND pincode=(?) OR blood=(?) ',[pin,blood]);
    }
    static getVolunteerByPin2(pin,age){
        return db.execute('SELECT * FROM volunteer WHERE enabled IS TRUE AND pincode=(?) ',[pin]);
    }
}