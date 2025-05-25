
import { supabase } from './client';

// This file is used to set up realtime subscriptions for tables
export const enableRealtimeForTable = async (tableName: string) => {
  try {
    // Enable row level changes for the table
    const { error } = await supabase.rpc('supabase_functions.enable_realtime', { 
      table_name: tableName 
    });
    
    if (error) {
      console.error(`Error enabling realtime for ${tableName}:`, error.message);
      return false;
    }
    
    console.log(`Realtime enabled for ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Error in enableRealtimeForTable for ${tableName}:`, error);
    return false;
  }
};

// Function to initialize realtime for specific tables when needed
export const initializeRealtime = async () => {
  await enableRealtimeForTable('orders');
  await enableRealtimeForTable('order_items');
  await enableRealtimeForTable('coupons');
  await enableRealtimeForTable('bundles');
};
