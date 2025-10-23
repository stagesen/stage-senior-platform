import { GoogleAdsApi } from 'google-ads-api';

/**
 * Diagnostic script to troubleshoot Google Ads API access
 */

const CONFIG = {
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
};

const REFRESH_TOKEN = process.env.GOOGLE_ADS_REFRESH_TOKEN || '';
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '';

console.log('🔍 Google Ads API Access Diagnostic\n');
console.log('Configuration Check:');
console.log('  Client ID:', CONFIG.client_id ? '✓ Set' : '✗ Missing');
console.log('  Client Secret:', CONFIG.client_secret ? '✓ Set' : '✗ Missing');
console.log('  Developer Token:', CONFIG.developer_token ? '✓ Set' : '✗ Missing');
console.log('  Refresh Token:', REFRESH_TOKEN ? '✓ Set' : '✗ Missing');
console.log('  Customer ID:', CUSTOMER_ID || 'Not set');
console.log('');

async function diagnose() {
  try {
    console.log('📡 Attempting to list accessible customers...\n');
    
    const client = new GoogleAdsApi(CONFIG);
    
    // List accessible customers
    const accessibleCustomers = await client.listAccessibleCustomers(REFRESH_TOKEN);
    
    console.log('✅ Successfully connected to Google Ads API!\n');
    console.log('Accessible Customer Accounts:');
    console.log('=============================');
    
    if (accessibleCustomers.resource_names && accessibleCustomers.resource_names.length > 0) {
      accessibleCustomers.resource_names.forEach((resourceName: string, index: number) => {
        const customerId = resourceName.split('/')[1];
        const isCurrentConfig = customerId === CUSTOMER_ID;
        console.log(`${index + 1}. Account ID: ${customerId} ${isCurrentConfig ? '← Currently configured' : ''}`);
        console.log(`   Resource Name: ${resourceName}`);
      });
      
      console.log('\n📋 Recommendations:');
      console.log('==================');
      
      if (accessibleCustomers.resource_names.length === 1) {
        const singleCustomerId = accessibleCustomers.resource_names[0].split('/')[1];
        console.log('You have access to 1 account.');
        if (singleCustomerId === CUSTOMER_ID) {
          console.log('✓ Your GOOGLE_ADS_CUSTOMER_ID is correctly set.');
          console.log('✓ Since you only have one account, you likely don\'t need login_customer_id.');
          console.log('\n⚠️  However, API access may not be enabled on this account.');
          console.log('   Please check:');
          console.log('   1. Go to ads.google.com');
          console.log('   2. Click Tools & Settings → Setup → API Center');
          console.log('   3. Make sure API access is enabled');
        } else {
          console.log(`⚠️  Your configured customer ID (${CUSTOMER_ID}) doesn't match your accessible account.`);
          console.log(`   Update GOOGLE_ADS_CUSTOMER_ID to: ${singleCustomerId}`);
        }
      } else {
        console.log(`You have access to ${accessibleCustomers.resource_names.length} accounts.`);
        console.log('This suggests a Manager (MCC) account structure.\n');
        
        const customerIds = accessibleCustomers.resource_names.map((rn: string) => rn.split('/')[1]);
        
        if (customerIds.includes(CUSTOMER_ID)) {
          console.log(`✓ Your configured customer ID (${CUSTOMER_ID}) is in the accessible list.`);
          
          // Try to determine which is the manager account
          const otherAccounts = customerIds.filter((id: string) => id !== CUSTOMER_ID);
          if (otherAccounts.length > 0) {
            console.log('\n💡 Account Structure Suggestion:');
            console.log(`   Set GOOGLE_ADS_LOGIN_CUSTOMER_ID to one of these (likely the manager):`)
            otherAccounts.forEach((id: string) => {
              console.log(`   - ${id}`);
            });
          }
        } else {
          console.log(`⚠️  Your configured customer ID (${CUSTOMER_ID}) is NOT in the accessible list.`);
          console.log('   You should use one of the accounts listed above.');
        }
      }
    } else {
      console.log('⚠️  No customer accounts found.');
      console.log('   This refresh token may not have the correct permissions.');
    }
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('========================');
    console.log('1. Regenerate your refresh token at: https://developers.google.com/oauthplayground/');
    console.log('   - Use OAuth scope: https://www.googleapis.com/auth/adwords');
    console.log('   - Make sure you\'re logged into the correct Google account');
    console.log('2. Verify API access is enabled in your Google Ads account');
    console.log('3. Check that your developer token is approved (not in test mode)');
  }
}

diagnose();
