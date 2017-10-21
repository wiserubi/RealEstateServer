var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RealEstate' });
});

//회원로그인
router.post('/usr/login', function(req,res){
	var id = req.body.id;
	var password = req.body.password;
	res.send(JSON.stringify({id:id,password:password}));
});

//회원가입
router.post('/usr', function(req,res){
	var id = req.body.id;
	var password= req.body.password;
	res.send(JSON.stringify({id:id,password:password}));
});

//회원조회
router.get('/usr', function(req,res){
	var rowid = req.query.rowid;
	res.send(JSON.stringify({rowid:rowid}));
});
//회원수정

router.put('/usr', function(req,res){
	var rowid = req.body.rowid;
	var id = req.body.id;
	var password = req.body.password;

	res.send(JSON.stringify({rowid:rowid,id:id,password:password}));	
});

//회원탈퇴
router.delete('/usr', function(req,res){
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});

//전체회원조회
router.get('/usr/list', function(req,res){
	res.send(JSON.stringify({}));
});

//매물등록
router.post('/offer', function(req,res){
	var date = req.body.date;
	var location = req.body.location;
	var total_amt = req.body.total_amt;
	var orignal_amt = req.body.orignal_amt;
	var premium= req.body.premium;
	var rent = req.body.rent;
	var loan= req.body.loan;
	var migration_fee = req.body.migration_fee;
	var tax = req.body.tax;
	var gisang = req.body.gisang;
	var myinterest = req.body.myinterest;

	res.send(JSON.stringify({date:date,location:location,total_amt:total_amt,
		original_amt:original_amt,premium:premium,rent:rent,loan:loan,
		migraiont_fee:migration_fee,tax:tax,gisang:gisang,interest:interest}));
});

//매물삭제
router.delete('/offer', function(req,res){
	var rowid = req.body.rowid;
	res.send(JSON.stringify({}));
});

//전체매물조회
router.get('/offer/list', function(req,res){
	res.send(JSON.stringify({}));
});

// 베스트매물조회
router.get('/offer/best', function(req,res){
	var totoamt = req.query.totamt;
	res.send(JSON.stringify({totmat:totamt}));

});

// 지역별 매물조회
router.get('/offer/location', function(req,res){
	var location = req.query.location;
	res.send(JSON.stringify({location:location}));

});

// 내관심 매물 조회
router.get('/offer/interest', function(req,res){
	var interest = req.query.interest;
	res.send(JSON.stringify({interest:interest}));
});

/**대출금**/
router.post('/loan', function(req,res){
	var date = req.body.date;
	var gubun = req.body.gubun;
	var bank = req.body.bank;
	var loanamt = req.body.loanamt;
	var interest = req.body.interest;
	var rate= req.body.rate;
	var period = req.body.period;

	res.send(JSON.stringify({date:date,gubun:gubun,bank:bank,loanamt:loanamt,
		interest:interest,rate:rate,period:period}));
});

router.get('/loan/list', function(req,res){
  res.send(JSON.stringify({}));
});


module.exports = router;
