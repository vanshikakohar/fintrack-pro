// backend/controllers/splitController.js
import Group from "../models/Group.js";
import GroupExpense from "../models/GroupExpense.js";
import Settlement from "../models/Settlement.js";

/** Create a group */
export const createGroup = async (req, res) => {
  try {
    const { name, members = [], userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId required",
      });
    }

    const g = new Group({
      name,
      members,
      userId,
    });

    await g.save();

    res.status(201).json(g);

  } catch (err) {
    console.error("createGroup:", err);

    res.status(500).json({
      message: "Error creating group",
      error: err.message,
    });
  }
};

export const getGroups = async (req, res) => {
  try {

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId required",
      });
    }

    const groups = await Group.find({ userId });

    res.json(groups);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Error fetching groups",
    });
  }
};

/**
 * Add group expense.
 * Body: { groupId, description, amount, paidBy, splitType, splits: [{memberName,amount}] }
 */
export const addGroupExpense = async (req, res) => {
  try {
    const { groupId, description, amount, paidBy, splitType = "equal", splits = [] } = req.body;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Build final splits
    let finalSplits = [];
    if (splitType === "equal" || !splits.length) {
      const per = Number(amount) / (group.members.length || 1);
      finalSplits = group.members.map(m => ({ memberName: m.name, amount: Math.round(per*100)/100 }));
    } else if (splitType === "percent") {
      // splits contain {memberName, percent}
      finalSplits = splits.map(s => ({ memberName: s.memberName, amount: Math.round(Number(amount) * (Number(s.percent||0)/100) * 100)/100 }));
    } else {
      // custom amounts
      finalSplits = splits.map(s => ({ memberName: s.memberName, amount: Number(s.amount || 0) }));
      // if rounding mismatch, adjust small diff to payer
      const totalSplit = finalSplits.reduce((a,b)=>a+b.amount,0);
      const diff = Math.round((Number(amount)-totalSplit)*100)/100;
      if (Math.abs(diff) >= 0.01) {
        // add diff to payer's split if exists
        const payerSplit = finalSplits.find(s=>s.memberName===paidBy);
        if (payerSplit) payerSplit.amount += diff;
        else finalSplits[0].amount += diff;
      }
    }

    const exp = new GroupExpense({
      group: groupId,
      description,
      amount: Number(amount),
      paidBy,
      splits: finalSplits
    });

    await exp.save();
    res.status(201).json(exp);
  } catch (err) {
    console.error("addGroupExpense:", err);
    res.status(500).json({ message: "Error adding group expense" });
  }
};

/** Get group expenses + computed balances (net per person) */
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const expenses = await GroupExpense.find({ group: groupId }).sort({ date: -1 });

    // compute net balances
    const balances = {}; // positive = this person should receive, negative = owes
    group.members.forEach(m => balances[m.name] = 0);

    expenses.forEach(e => {
      balances[e.paidBy] = (balances[e.paidBy] || 0) + Number(e.amount || 0);
      (e.splits || []).forEach(s => {
        balances[s.memberName] = (balances[s.memberName] || 0) - Number(s.amount || 0);
      });
    });

    res.json({ group, expenses, balances });
  } catch (err) {
    console.error("getGroupExpenses:", err);
    res.status(500).json({ message: "Error fetching group expenses" });
  }
};

/** Create settlement (manual) */
export const createSettlement = async (req, res) => {
  try {
    const { from, to, amount, group } = req.body;
    const s = new Settlement({ from, to, amount: Number(amount), group });
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    console.error("createSettlement:", err);
    res.status(500).json({ message: "Error creating settlement" });
  }
};

export const getSettlements = async (req, res) => {
  try {
    const settlements = await Settlement.find().sort({ date: -1 });
    res.json(settlements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching settlements" });
  }
};

/** Optional: auto-generate minimal match settlements (greedy netting) */
export const generateSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const expenses = await GroupExpense.find({ group: groupId });
    const net = {};
    group.members.forEach(m => net[m.name] = 0);
    expenses.forEach(e => {
      net[e.paidBy] += Number(e.amount || 0);
      e.splits.forEach(s => net[s.memberName] -= Number(s.amount || 0));
    });

    // convert to arrays
    const creditors = [];
    const debtors = [];
    for (const [name, amount] of Object.entries(net)) {
      const rounded = Math.round(amount*100)/100;
      if (rounded > 0) creditors.push({ name, amount: rounded });
      else if (rounded < 0) debtors.push({ name, amount: -rounded }); // store positive owed
    }

    // greedy match
    const settlements = [];
    creditors.sort((a,b)=>b.amount-a.amount);
    debtors.sort((a,b)=>b.amount-a.amount);

    let i=0,j=0;
    while(i<creditors.length && j<debtors.length){
      const c = creditors[i];
      const d = debtors[j];
      const amt = Math.min(c.amount, d.amount);
      settlements.push({ from: d.name, to: c.name, amount: Math.round(amt*100)/100 });
      c.amount -= amt;
      d.amount -= amt;
      if (Math.abs(c.amount) < 0.01) i++;
      if (Math.abs(d.amount) < 0.01) j++;
    }

    res.json({ settlements });
  } catch (err) {
    console.error("generateSettlements:", err);
    res.status(500).json({ message: "Error generating settlements" });
  }
};
