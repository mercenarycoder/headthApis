const db=require('../util/database');
module.exports=class searches{
    constructor(number,name,blood,address,age,requirement){
        this.number=number;
        this.name=name;
        this.blood=blood;
        this.address=address;
        this.age=age;
        this.requirement=requirement;
    }
    save(){
        return db.execute('INSERT INTO searchers (number,name,blood,address,age,requirement) VALUES (?,?,?,?,?,?)',[this.number,this.name,this.blood,this.address,this.age,this.requirement]);
    }
    static getAllRequest(){
        return db.execute('SELECT * FROM searchers');
    }
}