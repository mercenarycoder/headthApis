const express=require('express');
const {body}=require('express-validator');
const controlauth=require('../controller/controlauth');
const extras=require('../controller/extras');

const router=express();

router.post('/newUser', [
    body('mobile').trim().isLength({min:10}),
    body('name').trim().isLength({min:3}),
    body('height').trim().isLength({min:2}),
    body('weight').trim().isLength({min:2}),
    body('blood').trim().isLength({min:1})
] , controlauth.registerUser);

router.post('/emergency',controlauth.emergencyAdder);

router.post('/prescription',controlauth.addPrescription);

router.post('/getprofile',[
    body('mobile').trim().not().isEmpty().withMessage('please enter a valid phone number')
],controlauth.getProfile);

router.post('/getemergency',[
    body('mobile').trim().isLength({min:10}).withMessage("please Enter a valid phone number")
],controlauth.getEmergency);

router.post('/getImage',controlauth.addImage);
//route to get prescriptions by mobile number which is unique
router.post('/getprescriptions',[body('mobile').trim().isLength({min:10}).withMessage("please Enter a valid phone number")],controlauth.getPrescriptions);

router.post('/getReverseprescriptions',[body('mobile').trim().isLength({min:10}).withMessage("please Enter a valid phone number")],controlauth.getReversePrescriptions);


router.post('/updateUser', [
    body('mobile').trim().isLength({min:10}),
    body('name').trim().isLength({min:3}),
    body('height').trim().isLength({min:2}),
    body('weight').trim().isLength({min:2}),
    body('blood').trim().isLength({min:1})
] , controlauth.updateProfile);

router.post('/updateEmergency',[
    body('phone').trim().isLength({min:10}).withMessage("Please Send a valid number"),
    body('rec_id').trim().isLength({min:1}).withMessage("Id cannot be null")
],controlauth.updateEmergency);
//route to add a single emergency cotact
router.post('/singleEmergency',controlauth.saveSingleEmergency);
//route to get the main layout prescription max length 3
router.post('/frontpres',controlauth.frontPrescription);
//route to add a new allergy,medicine,dieseas,history
router.post('/allergyAdd',extras.addAllergy);
router.post('/dieseasAdd',extras.addDieseas);
router.post('/historyAdd',extras.addHistory);
router.post('/medicineAdd',extras.addMedicine);
//routes to get all the allergy,medicine,dieseas,history of a user
router.post('/getDieseas',extras.getDieseas);
router.post('/getAllergy',extras.getallergy);
router.post('/getHistory',extras.getHistory);
router.post('/getMedicine',extras.getMedicines);
//updation routes of allergies,medicine,dieseas and history of a user
router.post('/updateAllergy',extras.updateAllergy);
router.post('/updateHistory',extras.updateHistory);
router.post('/updateMedicine',extras.updateMedicine);
router.post('/updateDiesease',extras.updateDieseas);
//routes to delete allergy,history,medicine,dieseas
router.post('/deleteAllergy',extras.deleteAllergy);
router.post('/deleteHistory',extras.deleteHistory);
router.post('/deleteMedicine',extras.deleteMedicine);
router.post('/deleteDieseas',extras.deleteDieases);
router.post('/deletePrescription',controlauth.deletePres);
router.post('/deleteReport',controlauth.deleteReports);
//route to add a report
router.post('/addReport',controlauth.addReport);
//route to get reports specific to a user
router.post('/getReports',controlauth.getReports);
//route to get top reports
router.post('/gettopreport',controlauth.getTopReports);
//route to get reverse prescriptions
router.post('/getReverseReports',controlauth.getReverseReports);
//route for qr scanner
router.post('/getQR',controlauth.qrScanner);
//to get the level of the user
router.post('/getLevel',controlauth.getLevel);
//routes to upgrade your profile
router.post('/upgradeP',controlauth.upgradeProfile);
router.post('/checkStatus',controlauth.checkProfilestatus);
//route to get inner notifications
router.post('/notification',extras.getNotification);
router.post('/deleteNotification',extras.deleteNotification);
router.post('/updateNotification',extras.updateNotification);
//urls to enable share option
router.get('/checkShare',extras.checkRequest);
router.post('/confirm',extras.confirmCheck);

router.post('/deleteEmergency',controlauth.deleteEmergency);
//delete data from backend
router.post('/deleteData',controlauth.deleteData);
//add images to backed in base64 from android
router.post('/addImage64',controlauth.addImage64);
//updating reports and prescriptions
router.post('/updatePrescription',controlauth.updatePrescription);
router.post('/updateReport',controlauth.updateReport);
//route to record the qr access history and also the location where it was recorded
router.post('/recordLocation',extras.updateLocationAccess);
//user validator of otp after login
router.post('/newOtp',extras.setOtpVerifier);
router.post('/updateOtp',extras.updateOtpVerifier);
router.post('/checkOtp',extras.checkOtpVerifier);
router.post('/deleteOtp',extras.deleteOtp);
//mycovid profile routes
router.post('/getCovidProfile',controlauth.getCovidInfo);
router.post('/submitData',controlauth.submitData);
router.post('/volunteer',controlauth.changeVolunteer);
// routes to set and get volunteers
router.post('/setVolunteer',controlauth.setVolunteer);
router.post('/getVolunteer',controlauth.getVolunteer);
router.post('/getVolunteerCity',controlauth.getVolunteerByCity);
router.post('/getVolunteerPin',controlauth.getVolunteerByPin1);
//route for getting default volunteer profile
router.post('/defaultVolunteer',controlauth.checkVolunteerInfo);
//bulk request notifications apis
router.post('/raiseAlarm',extras.addBulkEmergency);
router.post('/getBulks',extras.searchBulk);
router.post('/changeBulkStatus',extras.changeBulkStatus);
router.post('/getAllRequests',extras.getAllRequests);
module.exports=router;