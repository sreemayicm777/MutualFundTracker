import cron from "node-cron";
import Portfolio from "../models/Portfolio.js";
import FundLatestNav from "../models/FundLatestNav.js";
import FundNavHistory from "../models/FundNavHistory.js";
import { fetchCurrentNav } from "../services/fundService.js"; // Fixed path

// Update Latest NAV in DB
const updateLatestNAV = async (schemeCode, navData) => {
  try {
    return await FundLatestNav.findOneAndUpdate(
      { schemeCode },
      {
        schemeCode,
        nav: parseFloat(navData.nav),
        date: navData.date,
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error(`Error updating latest NAV for ${schemeCode}:`, error);
    throw error;
  }
};

// Add NAV to History (with duplicate check)
const addNAVHistory = async (schemeCode, navData) => {
  try {
    // Check if entry already exists for this date
    const existingEntry = await FundNavHistory.findOne({
      schemeCode,
      date: navData.date
    });
    
    if (!existingEntry) {
      return await FundNavHistory.create({
        schemeCode,
        nav: parseFloat(navData.nav),
        date: navData.date,
      });
    } else {
      console.log(`NAV history already exists for ${schemeCode} on ${navData.date}`);
      return existingEntry;
    }
  } catch (error) {
    console.error(`Error adding NAV history for ${schemeCode}:`, error);
    throw error;
  }
};

// Fetch Latest NAV from API with error handling
const fetchLatestNAV = async (schemeCode) => {
  try {
    const response = await fetchCurrentNav(schemeCode);
    const latestData = response?.data?.[0];
    if (!latestData) {
      throw new Error(`No NAV data for scheme ${schemeCode}`);
    }
    return latestData;
  } catch (error) {
    console.error(`Error fetching NAV for ${schemeCode}:`, error);
    throw error;
  }
};

// Add a delay function for rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const runNAVUpdateNow = async () => {
  console.log("NAV update started at", new Date().toISOString());

  try {
    const portfolioSchemes = await Portfolio.distinct("schemeCode");
    console.log(`Found ${portfolioSchemes.length} schemes to update`);

    for (let i = 0; i < portfolioSchemes.length; i++) {
      const schemeCode = portfolioSchemes[i];
      
      try {
        console.log(`Processing scheme ${i+1}/${portfolioSchemes.length}: ${schemeCode}`);
        
        const latestNav = await fetchLatestNAV(schemeCode);
        await updateLatestNAV(schemeCode, latestNav);
        await addNAVHistory(schemeCode, latestNav);
        
        console.log(`Successfully updated NAV for ${schemeCode}`);
        
        // Add delay between requests to avoid rate limiting (500ms)
        if (i < portfolioSchemes.length - 1) {
          await delay(500);
        }
      } catch (error) {
        console.error(`Failed to process scheme ${schemeCode}:`, error.message);
        // Continue with next scheme even if this one fails
      }
    }

    console.log("NAV update completed successfully");
    return { success: true, message: "NAV update completed" };
  } catch (error) {
    console.error("NAV update failed:", error);
    return { success: false, message: error.message };
  }
};

export const scheduleDailyNAVUpdate = () => {
  // Schedule: Every day at 12:00 AM IST (18:30 UTC)
  const job = cron.schedule("30 18 * * *", async () => {
    console.log("Starting daily NAV update at", new Date().toISOString());
    await runNAVUpdateNow();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata", 
  });
  
  console.log("Daily NAV update cron job scheduled");
  return job;
};

// Start the scheduled job when this module is imported
scheduleDailyNAVUpdate();