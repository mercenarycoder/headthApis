const db=require('../util/database');

module.exports=class covid_table{
    constructor(mobile)
    {
        this.mobile=mobile;
    }
    save()
    {
        return db.execute('INSERT INTO covid_table (mobile) VALUES (?)',[this.mobile]);
    }
    static checkUser(mobile)
    {
        return db.execute('SELECT COUNT(mobile) AS present FROM covid_table WHERE mobile=(?)',[mobile]);
    }
    static getuserData(mobile){
        return db.execute('SELECT * FROM covid_table WHERE mobile=(?)',[mobile]);
    }
    static submitData(type,path,mobile)
    {
        switch(type){
            case 'certificate':
            {
                return db.execute('UPDATE covid_table SET recovery=(?) WHERE mobile=(?)',[path,mobile]);
            }
            case 'shot1':
            {
                return db.execute('UPDATE covid_table SET shot1=(?) WHERE mobile=(?)',[path,mobile]);
            }
            case 'shot2':
            {
                return db.execute('UPDATE covid_table SET shot2=(?) WHERE mobile=(?)',[path,mobile]);
            }
            default:
            {
                return null;
            }
        }
    }
    static changeVolunteer(mobile,value){
        
        return db.execute('UPDATE covid_table SET volunter=(?) WHERE mobile=(?)',[value,mobile]);
    }
    
}