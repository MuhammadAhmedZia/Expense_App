const Expense = require('../models/expense');
const User = require('../models/user');


const HandleToGetDashboard = async (req,res) => {
    try {
        // const userId = req.session.userId;
        // const user = await User.findById(userId);
        // // console.log(user);
        // if(!user){
        //     res.redirect('/login');
        // }
        
        const expenses =  await Expense.find({ userId:req.user.userId });
        // console.log(expenses);
        const totalIncome =  expenses
        .filter(e=> e.type === 'income')
        .reduce((acc, current)=> acc + current.amount, 0);
        
        const totalExpense =  expenses
        .filter(e=> e.type === 'expense')
        .reduce((acc, current)=> acc + current.amount, 0);

        const totalAmount = totalIncome - totalExpense;

        res.render('newDashboard', {
            username: req.user.username,
            totalAmount,
            totalIncome,
            totalExpense,
            expenses,
        });
        

    } catch (error) {
        console.error('failed to dashobard',error);
        res.redirect('/login');
    }
}

const HandleToAddTransaction = async (req, res) => {
    try {
        const {type,amount,description} = req.body;
        const userId = req.user.userId;

        await Expense.create({
            type,
            amount: parseFloat(amount),
            description,
            userId,
            createdAt: new Date()
        });
        res.redirect('/')
    } catch (error) {
        console.error('failed to dashobard',error);
        res.redirect('/');
    }
}


const HandleToGetEditTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const transaction = await Expense.findById(transactionId);

        if(!transaction) return res.redirect('/');
        
        res.render('editTransaction',{transaction});

    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.redirect('/');
    }
}

const HandleToPostEditTransaction = async (req, res) => {
   try {
    const transactionId = req.params.id;
    const {type, amount, description} = req.body;

    await Expense.findByIdAndUpdate(transactionId,{
        type,
        amount: parseFloat(amount),
        description,
    });
    res.redirect('/');
   } catch (error) {
    onsole.error('Error updating transaction:', error);
        res.redirect('/');
   }
}
const HandleToDeleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        await Expense.findByIdAndDelete(transactionId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.redirect('/');
    }
}
module.exports = {
    HandleToGetDashboard,
    HandleToAddTransaction,
    HandleToGetEditTransaction,
    HandleToPostEditTransaction,
    HandleToDeleteTransaction,
}