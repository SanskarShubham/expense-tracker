const Expense = require('../models/expense');

exports.postAddExpense = async (req, res, next) => {
  try {
    const { amount, description, category } = req.body;

    const expense = new Expense({
      amount,
      description,
      category,
      userId: req.user
    });
    await  expense.save();
    await req.user.updateTotalExpense(amount);

    res.status(200).json({
      status: true,
      data: expense,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

exports.postEditExpense = async (req, res, next) => {
  try {
    const { id, amount, description, category } = req.body;

    // Find the existing expense by ID and user ID
    const existingExpense = await Expense.findOne({ _id: id, userId: req.user.id });

    // If expense not found or user doesn't have permission, throw an error
    if (!existingExpense) {
      throw new Error('Expense not found or you do not have permission to edit');
    }

    // Calculate the difference in amount for updating user's totalExpense
    const amountDifference = amount - existingExpense.amount;

    // Update user's totalExpense
    req.user.totalExpense += amountDifference;
    await req.user.save();

    // Update the existing expense
    await existingExpense.updateOne({ amount, description, category });

    // Send success response
    res.status(200).json({
      status: true,
      data: { id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};

exports.postDeleteExpense = async (req, res, next) => {
  try {
    const id = req.params.expenseid;

    // Find the expense by ID and user ID
    const expense = await Expense.findOne({ _id: id, userId: req.user.id });

    // If expense not found or user doesn't have permission, throw an error
    if (!expense) {
      throw new Error('Expense not found or you do not have permission to delete');
    }

    // Update user's totalExpense by subtracting the amount of the expense
    req.user.totalExpense -= expense.amount;
    await req.user.save();

    // Delete the expense
    await expense.deleteOne();

    // Send success response
    res.status(200).json({
      status: true,
      data: { id },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};
exports.getExpenses = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.page) || 1;
    const ITEM_PER_PAGE = parseInt(req.query.rowPerPage) || 5;

    // Calculate skip value for pagination
    const skip = (pageNo - 1) * ITEM_PER_PAGE;

    // Fetch expenses using Mongoose
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(ITEM_PER_PAGE)
      .exec();

    // Count total expenses
    const totalExpenseCount = await Expense.countDocuments({ userId: req.user.id });

    // Calculate total page count
    const lastPage = Math.ceil(totalExpenseCount / ITEM_PER_PAGE);

    // Determine pagination flags
    const hasNextPage = pageNo * ITEM_PER_PAGE < totalExpenseCount;
    const nextPage = pageNo + 1;
    const hasPrevPage = pageNo > 1;
    const PrevPage = pageNo - 1;

    // Send response
    res.status(200).json({
      status: true,
      expenses,
      lastPage,
      hasNextPage,
      nextPage,
      hasPrevPage,
      PrevPage,
      pageNo
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err.message
    });
  }
};
exports.getEditExpense = async (req, res, next) => {
  try {
    const expenseid = req.params.expenseid;
    const expense = await Expense.findOne({_id:expenseid});
    if (!expense) {
      throw new Error('Expense not found');
    }
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
};
