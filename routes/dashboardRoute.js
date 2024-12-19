const  router = require('express').Router();
const {HandleToGetDashboard, HandleToAddTransaction, HandleToDeleteTransaction, HandleToGetEditTransaction, HandleToPostEditTransaction} = require('../controllers/dashboardController');
const { verifyToLogedInUser, refreshToken ,} = require('../middlewares/auth');

// router.get('/dashboard',(req,res)=> res.render('dashboard'));

router.use(refreshToken)

router.get('/',verifyToLogedInUser, HandleToGetDashboard);
router.post('/dashboard/add-transaction',verifyToLogedInUser,HandleToAddTransaction);

router.get('/dashboard/edit-transaction/:id',verifyToLogedInUser,HandleToGetEditTransaction);
router.post('/dashboard/edit-transaction/:id',verifyToLogedInUser,HandleToPostEditTransaction);

router.post('/dashboard/delete-transaction/:id',HandleToDeleteTransaction);
module.exports = router;