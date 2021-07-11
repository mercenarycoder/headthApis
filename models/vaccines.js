const db=require('../util/database');

module.exports=class Vaccine{
    contructor(mobile,title,date,image,doctor,observation)
    {
        this.mobile=mobile;
        this.title=title;
        this.date=date;
        this.image=image;
        this.doctor=doctor;
        this.observation=observation;
        console.log(this.mobile+","+this.title+","+this.date+","+this.image+","+this.doctor+","+this.observation);
    }
    save()
    {
        let result;
        try{
        result= db.execute('INSERT INTO vaccines(mobile,title,date,image,doctor,observation) VALUES (?,?,?,?,?,?)',[this.mobile,this.title,this.date,this.image,this.doctor,this.observation]);
        }
        catch (error) {
            console.log("Error here");
            return error;
        }
        return result;
    }
    static saveIt(mobile,title,date,image,doctor,observation)
    {
        return db.execute('INSERT INTO vaccines(mobile,title,date,image,doctor,observation) VALUES (?,?,?,?,?,?)',[mobile,title,date,image,doctor,observation]);
    }
    static getAllById(mobile)
    {
        return db.execute('SELECT * FROM vaccines WHERE mobile=(?) ORDER BY date DESC',[mobile]);
    }
    static reverseOrder(mobile)
    {
        return db.execute('SELECT * FROM vaccines WHERE mobile=(?) ORDER BY date ASC',[mobile]);
    }
    static deletePres(id)
    {
        return db.execute('DELETE FROM vaccines WHERE id=(?)',[id]);
    }
    static getFrontPres(mobile)
    {
        return db.execute('SELECT * FROM vaccines WHERE mobile=(?) LIMIT 3',[mobile]);
    }
    static updatePres(id,mobile,title,date,image,doctor,observation)
    {
        return db.execute('UPDATE vaccines SET mobile=(?),title=(?),date=(?),image=(?),doctor=(?),observation=(?) WHERE id=(?)',[mobile,title,date,image,doctor,observation,id]);
    }
};