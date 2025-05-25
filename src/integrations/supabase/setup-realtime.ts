
import { supabase } from './client';

// This file is used to set up realtime subscriptions for tables
export const enableRealtimeForTable = async (tableName: string) => {
  try {
    // Check if realtime is already enabled by attempting to subscribe
    const testChannel = supabase
      .channel(`test_${tableName}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName }, 
        () => {}
      );
    
    const { error } = await testChannel.subscribe();
    
    if (error) {
      console.error(`Error enabling realtime for ${tableName}:`, error.message);
      return false;
    }
    
    // Unsubscribe the test channel
    await supabase.removeChannel(testChannel);
    
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
