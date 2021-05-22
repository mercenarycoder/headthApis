const history = require('../models/history');
const dieseas = require('../models/dieseas');
const medicine = require('../models/medicine');
const allergy = require('../models/allergy');
const al2 = require('../models/allergy');
const emergency = require('../models/emergency');
const qraccesshistory = require('../models/qraccesshistory');
const bulkEmergency = require('../models/bulkEmergency');
const notification = require('../models/notification');
const otptable = require('../models/otptable');
const bcrypt = require('bcryptjs');

exports.addBulkEmergency = async (req, res, next) => {
    try {
        const called = req.body.called;
        const caller = req.body.caller;
        if (!called || called.length != 10 || !caller || caller.length != 10) {
            const err = new Error('Invalid Data');
            err.statusCode = 200;
            throw err;
        }
        let adder = new bulkEmergency(caller, called, 0);
        adder.save().then(result => {
            res.status(201).json({ status: 1, msg: 'Bulk Emrgency Request raised Successfully' });
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        })
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    }
}
exports.searchBulk = async (req, res, next) => {
    try {
        const called = req.body.called;
        if (!called || called.length != 10) {
            const err = new Error('Invalid Request');
            err.statusCode = 200;
            throw err;
        }
        let num = await bulkEmergency.checkExistence(called);
        num = num[0];
        num = num[0];
        if (num.num === 0) {
            res.status(201).json({ status: 2, msg: "No notification for you" });
        }
        else {
            bulkEmergency.getMyAlarms(called).then(result => {
                res.status(201).json({ status: 1, data: result[0] });
            }).catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 200;
                }
                next(err);
            })
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    }

}
exports.getAllRequests = async (req, res, next) => {
    try {
        const called = req.body.called;
        if (!called || called.length != 10) {
            const err = new Error('Invalid Request');
            err.statusCode = 200;
            throw err;
        }
        bulkEmergency.getAllRequests(called).then(result => {
            res.status(201).json({ status: 1, data: result[0] });
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    }
}
exports.changeBulkStatus = async (req, res, next) => {
    try {
        const called = req.body.called;
        const caller = req.body.caller;
        if (!called || called.length != 10 || !caller || caller.length != 10) {
            const err = new Error('Invalid Data');
            err.statusCode = 200;
            throw err;
        }
        bulkEmergency.changeStatus(called, caller, 1).then(result => {
            console.log(result);
            res.status(201).json({ status: 1, msg: 'status changed for the bulk requests' });
        }).catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 200;
            }
            next(err);
        })
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    }
}
exports.addAllergy = (req, res, next) => {
    const mobile = req.body.mobile;
    const allergy = req.body.allergy;
    const triggers = req.body.triggers;
    console.log(mobile + " " + allergy + " " + triggers);
    if (!mobile || !allergy || !triggers) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const ale = new al2(mobile, allergy, triggers);
    ale.save().then(result => {
        t1 = "Allergy added " + allergy;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A allergy was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Record Added Successfully" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addHistory = (req, res, next) => {
    const mobile = req.body.mobile;
    const title = req.body.title;
    const description = req.body.description;
    if (!mobile || !title || !description) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const his = new history(mobile, title, description)
    his.save().then(result => {
        //  console.warn("you accessed me");
        t1 = "History added " + title;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A history was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Record Added Successfully" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addMedicine = (req, res, next) => {
    const mobile = req.body.mobile;
    const name = req.body.name;
    const purpose = req.body.purpose;
    const duration = req.body.duration;
    const dosage = req.body.dosage;
    if (!mobile || !name || !purpose || !duration || !dosage) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const med = new medicine(mobile, name, purpose, duration, dosage);
    med.save().then(result => {
        t1 = "Medicine added: " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A Medicine was added on " + dd + " .For the Duration of " + duration;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Record Added Successfully" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.addDieseas = (req, res, next) => {
    const mobile = req.body.mobile;
    const name = req.body.name;
    const details = req.body.details;

    if (!name || !mobile || !details) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    const die = new dieseas(mobile, name, details);
    die.save().then(result => {
        t1 = "Disease added: " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A dieseas was added on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Record Added Successfully" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getDieseas = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    dieseas.getDieseasByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getMedicines = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    medicine.getMedicines(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getallergy = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    allergy.getAllergyByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.getHistory = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile || mobile.length < 10) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    history.getHistoryByMobile(mobile).then(result => {
        res.status(201).json({ status: 1, data: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateAllergy = (req, res, next) => {
    const id = req.body.id;
    const allergy2 = req.body.allergy;
    const triggers = req.body.triggers;
    const mobile = req.body.mobile;
    if (!id || !allergy2 || !triggers) {
        const err = new Error("Valid arguments not passed");
        err.statusCode = 200;
        throw err;
    }
    allergy.updateAllergy(id, allergy2, triggers).then(result => {
        t1 = "Allergy updated:  " + allergy2;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A allergy was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Allergy Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateHistory = (req, res, next) => {
    const id = req.body.id;
    const title = req.body.title;
    const mobile = req.body.mobile;
    const description = req.body.description;
    if (!id || !title || !description) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    history.updateHistory(id, title, description).then(result => {
        t1 = "History updated:  " + title;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A history was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'History Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateMedicine = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const mobile = req.body.mobile;
    const purpose = req.body.purpose;
    const duration = req.body.duration;
    const dosage = req.body.dosage;
    if (!id || !name || !purpose || !duration || !dosage) {
        const err = new Error("Invalid Request.....");
        err.statusCode = 200;
        throw err;
    }
    medicine.updateMedicine(id, name, purpose, dosage, duration).then(result => {
        t1 = "Medicine updated:  " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A medicine was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Medicine Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateDieseas = (req, res, next) => {
    const id = req.body.id;
    const mobile = req.body.mobile;
    const name = req.body.name;
    const details = req.body.details;
    if (!id || !name || !details) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    dieseas.updateDiesease(id, name, details).then(result => {
        t1 = "Disease updated:  " + name;
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "A disease was updated on " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Disease Updated..' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.deleteMedicine = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            medicine.deleteMedicine(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Medicines deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in medicines are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteAllergy = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;
    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            allergy.deleteAllergy(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Allergies deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in allergies are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteHistory = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;

    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            history.deleteHistory(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "History deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in history are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.deleteDieases = (req, res, next) => {
    let id = req.body.id;
    const mobile = req.body.mobile;

    console.log(id);
    if (!id) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    else if (id.length <= 0) {
        const err = new Error('No Elements to be deleted');
        err.statusCode = 200;
        throw err;
    }
    else {
        id = id;
        for (i = 0; i < id.length; i++) {
            let obj = id[i];
            console.log(obj.id);
            dieseas.deleteDieseas(obj.id).then(result => {
                console.log(result);
            });
        }
        t1 = "Disease deleted";
        var date = new Date();
        let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        c1 = "Item or Items in disease are deleted on: " + dd;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: "Items deleted successfully" });
    }
}
exports.getNotification = (req, res, next) => {
    const mobile = req.body.mobile;
    if (!mobile) {
        const err = new Error("Invalid Request");
        err.statusCode = 200;
        throw err;
    }
    notification.getNotification(mobile).then(result => {
        res.status(201).json({ status: 1, obj: result[0] });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.setOtpVerifier = (req, res, next) => {
    const number = req.body.number;
    const otp = req.body.otp;
    console.log(number, " ", otp);
    if (!number || !otp) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    let oo = new otptable(number, otp);
    oo.save().then(result => {
        res.status(201).json({ status: 1, msg: 'Your 4 digit security pin is set. Please make a note of it as you will require the pin to log into your account in the future' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.deleteOtp = (req, res, next) => {
    const number = req.body.number;
    console.log(number, " ");
    if (!number) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    otptable.deleter(number).then(result => {
        res.status(201).json({ status: 1, msg: 'otp of your number deleted' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateOtpVerifier = (req, res, next) => {
    const number = req.body.number;
    const otp = req.body.otp;
    console.log(number, " ", otp);
    if (!number || !otp) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    otptable.updater(number, otp).then(result => {
        res.status(201).json({ status: 1, msg: "your otp is updated" });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.checkOtpVerifier = (req, res, next) => {
    const number = req.body.number;
    const otp = req.body.otp;
    console.log(number, " ", otp);
    if (!number || !otp) {
        const err = new Error("Invalid data");
        err.statusCode = 200;
        throw err;
    }
    otptable.checker(number).then(result => {
        let rr = result[0];
        rr = rr[0];
        if (rr.otp === otp) {
            res.status(201).json({ status: 1, msg: 'otp verified successfully' });
        }
        else {
            res.status(201).json({ status: 0, msg: 'otp verification failed' });
        }
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.checkRequest = (req, res, next) => {
    //method of extracting a query parameter from a get request
    const url = req.query.url;
    const mobile = req.query.mobile;
    if (!url) {
        const err = new Error('Invalid request');
        err.statusCode(200);
        throw err;
    }
    console.log(url);
    res.render('verify', { url: url, mobile: mobile });
}
exports.confirmCheck = (req, res, next) => {
    const phone = req.body.number;
    const url = req.body.url;
    const mobile = req.body.mobile;
    console.log(phone, url, mobile);
    if (!phone || !url || !mobile) {
        const err = new Error("Invalid Request..");
        err.statusCode = 200;
        throw err;
    }
    emergency.checkExistence(phone).then(result => {
        let num = result[0];
        num = num[0];
        num = num.god;
        console.log(num);
        if (num > 0) {
            t1 = "Your Document was viewed";
            var date = new Date();
            let dd = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
            c1 = "One of your document was viewed by:- " + phone + " on " + dd;
            addNotification(t1, c1, mobile);
            res.render('confirm', { url: url });
        }
        else {
            res.render('fail');
        }
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
exports.deleteNotification = (req, res, next) => {
    const id = req.body.id;
    if (!id) {
        const err = new Error('Invalid Request');
        err.statusCode = 200;
        throw err;
    }
    notification.deleteNotification(id).then(result => {
        res.status(201).json({ status: 1, msg: 'Notification hidden successfully' });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateNotification = (req, res, next) => {
    const id = req.body.id;
    if (!id) {
        const err = new Error('Invalid Request');
        err.statusCode = 200;
        throw err;
    }
    console.log(id);
    notification.updateNotification(id).then(result => {
        res.status(201).json({ status: 1, msg: "Notification status updated successfully" });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    });
}
exports.updateLocationAccess = (req, res, next) => {
    const user = req.body.user;
    const accesser = req.body.accesser;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const date = req.body.date;
    const time = req.body.time;
    console.log(user, " ", accesser, " ", latitude, " ", longitude, " ", date, " ", time);
    if (!user || !accesser || !date || !time || !latitude || !longitude) {
        const err = new Error("Invalid request");
        err.statusCode = 200;
        throw err;
    }
    const qr = new qraccesshistory(user, accesser, date, time, latitude, longitude);
    qr.save().then(result => {
        t1 = "Qr Scanned ";
        var date2 = new Date();
        let dd = date2.getDate() + "-" + date2.getMonth() + "-" + date2.getFullYear();
        c1 = `Your Qr Code was scanned ${dd} at location latitude:-${latitude} \n and longitude:-${longitude} click on notification to view it in map`;
        addNotification(t1, c1, mobile);
        res.status(201).json({ status: 1, msg: 'Qr access recorded' });
    }).catch(err => {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 200;
        }
        next(err);
    })
}
function addNotification(title, content, mobile) {
    var date = new Date();
    let dd = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    const N = new notification(mobile, title, content, dd);
    N.save().then(res => {
        console.log("Notification added successfully");
    }).catch(err => {
        console.log(err);
    });
}
