import Portfolio from "../models/Portfolio.js";
import Fund from "../models/Fund.js";
import FundLatestNav from "../models/FundLatestNav.js";
import FundNavHistory from "../models/FundNavHistory.js";
import { fetchCurrentNav, fetchHistoryNav } from "../services/fundService.js";

const updateLatestNav = async (schemeCode) => {
  const navResponse = await fetchCurrentNav(schemeCode);
  const latestData = navResponse?.data?.[0];

  if (latestData) {
    return await FundLatestNav.findOneAndUpdate(
      { schemeCode },
      {
        schemeCode,
        nav: parseFloat(latestData.nav),
        date: latestData.date,
      },
      { upsert: true, new: true }
    );
  }
  return null;
};

const updateHistoryNav = async (schemeCode) => {
  const navResponse = await fetchHistoryNav(schemeCode);
  const firstData = navResponse?.data?.slice(-1)[0]; // oldest NAV
  if (firstData) {
    return await FundNavHistory.findOneAndUpdate(
      { schemeCode },
      {
        schemeCode,
        nav: parseFloat(firstData.nav),
        date: firstData.date,
      },
      { upsert: true, new: true }
    );
  }
  return null;
};

export const addFundToPortfolio = async (req, res) => {
  try {
    const { schemeCode, units } = req.body;
    if (!schemeCode || !units) {
      return res.status(400).json({
        success: false,
        message: "Scheme code and units are required",
      });
    }
    const fund = await Fund.findOne({ schemeCode });

    if (!fund) {
      return res
        .status(404)
        .json({ success: false, message: "Fund Not Found" });
    }
    const portfolio = await Portfolio.create({
      userId: req.user._id,
      schemeCode,
      units,
    });

    await updateLatestNav(schemeCode);
    await updateHistoryNav(schemeCode);
    res.status(201).json({
      success: true,
      message: "Fund added to portfolio successfully",
      portfolio: {
        id: portfolio._id,
        schemeCode,
        schemeName: fund.schemeName,
        units,
        addedAt: portfolio.createdAt,
      },
    });
  } catch (error) {
    console.error("AddFundError:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//list

export const getPortfolioList = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id });
    const holdings = [];
    for (const item of portfolios) {
      const fund = await Fund.findOne({ schemeCode: item.schemeCode });
      console.log("fund", fund);

      const currentNav = await FundLatestNav.findOne({
        schemeCode: item.schemeCode,
      });
      console.log("currentNav ", currentNav);

      holdings.push({
        schemeCode: item.schemeCode,
        schemeName: fund.schemeName,
        units: item.units,
        currentNav: currentNav?.nav || 0,
        currentValue: currentNav ? item.units * currentNav?.nav : 0,
      });
    }
    console.log("nav", holdings);

    res.status(201).json({
      success: true,
      data: {
        holdings,
      },
    });
  } catch (error) {
    console.error("PortfolioListError", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//value
export const getPortfolioValue = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user._id });
    console.log("portfolios", portfolios);

    let totalInvestment = 0;
    let currentValue = 0;
    const holdings = [];
    for (const item of portfolios) {
      const fund = await Fund.findOne({ schemeCode: item.schemeCode });
      let currentNav = await FundLatestNav.findOne({
        schemeCode: item.schemeCode,
      });
      if (!currentNav) currentNav = await updateLatestNav(item.schemeCode);

      let historyNav = await FundNavHistory.findOne({
        schemeCode: item.schemeCode,
      });
      if (!historyNav) historyNav = await updateHistoryNav(item.schemeCode);
      console.log("current nav", currentNav);
      console.log("History nav", historyNav);

      const investedValue = historyNav ? item.units * historyNav?.nav : 0;
      const holdingsCurrentValue = currentNav
        ? item.units * currentNav?.nav
        : 0;
      totalInvestment = totalInvestment + investedValue;
      currentValue = currentValue + holdingsCurrentValue;

      holdings.push({
        schemeCode: item.schemeCode,
        schemeName: fund.schemeName,
        units: item.units,
        currentNav: currentNav?.nav || 0,
        currentValue: currentNav ? item.units * currentNav?.nav : 0,
        investedValue,
        profitLoss: holdingsCurrentValue - investedValue,
      });
    }

    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent =
      totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

    res.status(201).json({
      success: true,
      data: {
        totalInvestment,
        currentValue,
        profitLoss,
        profitLossPercent,
        asOn: new Date(),
        holdings,
      },
    });
  } catch (error) {
    console.error("PortfolioValueError", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getPortfolioHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const portfolios = await Portfolio.find({ userId: req.user._id });
    // console.log("portfolio = ", portfolios);
    
    if (portfolios.length === 0) {
        
      return res.json({ success: true, data: [] });
    }
    const schemeMap = {};
    portfolios.forEach((p) => {
      schemeMap[p.schemeCode] = p.units;
    });

    const schemeCodes = portfolios.map((p) => 
      p.schemeCode
    );
    console.log("schemeCode",schemeCodes);
    
    const history = await FundNavHistory.find({
        
      schemeCode: { $in: schemeCodes },
      
      ...(startDate && endDate
        ? { date: { $gte: startDate, $lte: endDate } }
        : {}),
    });
    console.log("his",history);
    
    const grouped = {};
    for (const nav of history) {
      if (!grouped[nav.date]) grouped[nav.date] = 0;
      const portfolio = portfolios.find((p) => p.schemeCode === nav.schemeCode);
      grouped[nav.date] += portfolio.units * nav.nav;
    }

    const data = Object.entries(grouped).map(([date, totalValue]) => ({
      
      date,
      totalValue,
      
    }));
    res.json({success:true, data})
  } catch (error) {
    console.error("PortfolioValueError", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const removePortfolioFund = async (req, res) => {
  try {
    const { schemeCode } = req.params;

    const result = await Portfolio.findOneAndDelete({
      userId:req.user._id,
      schemeCode: schemeCode,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Fund not found in portfolio",
      });
    }

    res.json({
      success: true,
      message: "Fund removed from portfolio successfully",
    });
  } catch (error) {
    console.error("RemovePortfolioError", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
