import Fund from "../models/Fund.js";
import { fetchAllFunds, fetchHistoryNav } from "../services/fundService.js";



export const getFunds = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const query = search
      ? { schemeName: { $regex: search, $options: "i" } }
      : {};

    const funds = await Fund.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalFunds = await Fund.countDocuments(query);

    const totalPages = Math.ceil(totalFunds / limit);

    res.json({
      success: true,
      data: {
        funds,
        pagination: {
          currentPage: page,
          totalPages,
          totalFunds,
          hasNext: page * limit < totalFunds,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncFundsToDB = async (req, res) => {
  try {
    const funds = await fetchAllFunds();

    for (const fund of funds) {
      await Fund.updateOne(
        { schemeCode: fund.schemeCode },
        // { $set: fund },
        {
          schemeCode: fund.schemeCode,
          schemeName: fund.schemeName,
          fundHouse: fund.fundHouse,
          schemeType: fund.schemeType,
          schemeCategory: fund.schemeCategory,
        },
        { upsert: true }
      );
    }

    res.json({ success: true, message: "Funds synced successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFundNavHistory = async (req, res) => {
  try {
    const { schemeCode } = req.params;
    const fund = await Fund.findOne({ schemeCode });
    if (!fund) {
      return res
        .status(404)
        .json({ success: false, message: "Fund Not Found" });
    }
    const navData = await fetchHistoryNav(schemeCode);
    console.log("navApiRes", navData);

    res.json({
      success: true,
      data: {
        schemeCode,
        schemeName: fund.schemeName,
        currentNav: navData.data[0].nav,
        asOn: navData.data[0].date,
        historyNav: navData.data.slice(0, 30),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch nav history" });
  }
};
