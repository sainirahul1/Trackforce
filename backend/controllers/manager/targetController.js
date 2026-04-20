const Target = require('../../models/employee/Target');
const EmployeeLogVisit = require('../../models/employee/EmployeeLogVisit');
const User = require('../../models/tenant/User');

// @desc    Set or update daily target for an employee
// @route   POST /api/manager/targets
// @access  Private (Manager)
exports.setTarget = async (req, res) => {
  try {
    const { employeeId, dailyTarget, date, note } = req.body;

    if (!employeeId || dailyTarget === undefined || !date) {
      return res.status(400).json({ message: 'Missing required fields: employeeId, dailyTarget, date' });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Check if target already exists for this day
    let target = await Target.findOne({
      employee: employeeId,
      date: targetDate,
      tenant: req.tenantId
    });

    if (target) {
      target.monthlyTarget = dailyTarget; // Using the field monthlyTarget with daily context
      target.note = note || target.note;
      target.manager = req.user._id;
      await target.save();
    } else {
      target = await Target.create({
        employee: employeeId,
        tenant: req.tenantId,
        manager: req.user._id,
        monthlyTarget: dailyTarget,
        date: targetDate,
        note
      });
    }

    res.status(200).json({ success: true, data: target });
  } catch (error) {
    console.error('[SET_TARGET_ERROR]', error.message);
    res.status(500).json({ message: 'Failed to set target', error: error.message });
  }
};

// @desc    Get daily target history and achievements for an employee
// @route   GET /api/manager/targets/history/:employeeId
// @access  Private (Manager)
exports.getTargetHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const targets = await Target.find({
      employee: employeeId,
      tenant: req.tenantId
    }).sort({ date: -1 }).limit(30);

    // Calculate achievement for each target day
    const history = await Promise.all(targets.map(async (t) => {
      const startDate = new Date(t.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(t.date);
      endDate.setHours(23, 59, 59, 999);

      const visitsCount = await EmployeeLogVisit.countDocuments({
        employee: employeeId,
        tenant: req.tenantId,
        timestamp: { $gte: startDate, $lte: endDate }
      });

      return {
        ...t.toObject(),
        achieved: visitsCount,
        percent: t.monthlyTarget > 0 ? Math.round((visitsCount / t.monthlyTarget) * 100) : 0
      };
    }));

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('[GET_HISTORY_ERROR]', error.message);
    res.status(500).json({ message: 'Failed to fetch target history' });
  }
};

// @desc    Get all employees with their today's targets
// @route   GET /api/manager/targets/employees
// @access  Private (Manager)
exports.getTargetsOverview = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Get all employees for this tenant
    const employees = await User.find({
      tenant: req.tenantId,
      role: 'employee'
    }).select('name email profile').lean();

    // Get targets for today
    const targets = await Target.find({
      tenant: req.tenantId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).lean();

    const targetMap = targets.reduce((acc, t) => {
      acc[t.employee.toString()] = t;
      return acc;
    }, {});

    const data = await Promise.all(employees.map(async (emp) => {
      const target = targetMap[emp._id.toString()];
      
      // Get today's visits
      const visitsCount = await EmployeeLogVisit.countDocuments({
        employee: emp._id,
        timestamp: { $gte: todayStart, $lte: todayEnd }
      });

      return {
        id: emp._id,
        name: emp.name,
        email: emp.email,
        designation: emp.profile?.designation || 'Employee',
        zone: emp.profile?.zone || emp.profile?.team || 'Unassigned',
        currentDailyTarget: target ? target.monthlyTarget : 0,
        achieved: visitsCount,
      };
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('[GET_OVERVIEW_ERROR]', error.message);
    res.status(500).json({ message: 'Failed to fetch targets overview' });
  }
};
