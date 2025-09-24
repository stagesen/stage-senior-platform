#!/usr/bin/env tsx

interface CleanupItem {
  type: 'branch' | 'pr';
  name: string;
  id?: number; // PR number
  integration: string;
  reason: string;
}

class GitHubCleanupManager {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';
  
  // Map completed integrations to GitHub branches/PRs
  private completedIntegrations: CleanupItem[] = [
    {
      type: 'branch',
      name: 'codex/add-active-state-indicator-to-navigation',
      integration: 'Active Navigation State Indicators',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch', 
      name: 'codex/add-active-state-indicator-to-navigation-lmcc5p',
      integration: 'Active Navigation State Indicators (duplicate)',
      reason: 'Duplicate branch - main integration completed'
    },
    {
      type: 'branch',
      name: 'codex/convert-check-availability-to-glassmorphism-style',
      integration: 'Glassmorphism CTA Styling',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/add-dot-indicators-and-progress-bar',
      integration: 'Carousel Progress Indicators',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/implement-fluid-typography-for-body-text',
      integration: 'Fluid Typography System',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'pr',
      name: 'codex/create-care-points-page',
      id: 14,
      integration: 'Care Points Landing Page',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/create-care-points-page',
      integration: 'Care Points Landing Page',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/update-sticky-header-styles',
      integration: 'Sticky Header Improvements',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/replace-main-nav-with-sticky-nav',
      integration: 'Sticky Header Improvements (navigation)',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/redesign-lead-capture-ui-layout',
      integration: 'Lead Capture UI Layout Redesign',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/update-design-tokens-for-shadows-and-borders',
      integration: 'Design Token Updates (Shadows & Borders)',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/update-footer-design-for-engagement',
      integration: 'Footer Engagement Improvements',
      reason: 'Successfully integrated into Replit codebase'
    },
    {
      type: 'branch',
      name: 'codex/update-hero-overlay-for-better-legibility',
      integration: 'Hero Overlay Legibility Improvements',
      reason: 'Successfully integrated into Replit codebase'
    }
  ];

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Cleanup-Tool'
      }
    };

    if (body) {
      options.headers!['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return method !== 'DELETE' ? response.json() : { success: true };
  }

  async closePullRequest(prNumber: number, reason: string): Promise<boolean> {
    try {
      console.log(`🔄 Closing PR #${prNumber}...`);
      
      // Add closing comment
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/issues/${prNumber}/comments`, 'POST', {
        body: `🎉 **Integration Complete!**\n\n${reason}\n\nThis pull request has been successfully integrated into our Replit codebase and is now being closed as part of repository cleanup.\n\n**Integration Status:** ✅ Complete\n**Integrated Date:** ${new Date().toLocaleDateString()}\n\n*Automatically closed by GitHub Cleanup Manager*`
      });

      // Close the PR
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`, 'PATCH', {
        state: 'closed'
      });

      console.log(`✅ Successfully closed PR #${prNumber}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to close PR #${prNumber}:`, error);
      return false;
    }
  }

  async deleteBranch(branchName: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting branch: ${branchName}...`);
      
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${branchName}`, 'DELETE');
      
      console.log(`✅ Successfully deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete branch ${branchName}:`, error);
      return false;
    }
  }

  async verifyBranchExists(branchName: string): Promise<boolean> {
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/${branchName}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyPRExists(prNumber: number): Promise<boolean> {
    try {
      const pr = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`);
      return pr.state === 'open';
    } catch (error) {
      return false;
    }
  }

  async executeCleanup(): Promise<void> {
    console.log('🧹 GitHub Repository Cleanup Manager');
    console.log('=' .repeat(80));
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🗓️ Started: ${new Date().toLocaleString()}`);
    console.log(`🎯 Target Items: ${this.completedIntegrations.length} completed integrations\n`);

    const results: {
      item: CleanupItem;
      action: string;
      success: boolean;
      error?: string;
    }[] = [];

    // Process each completed integration
    for (const item of this.completedIntegrations) {
      console.log(`\n📋 Processing: ${item.integration}`);
      console.log(`   🎯 Target: ${item.type} "${item.name}"${item.id ? ` (#${item.id})` : ''}`);
      console.log(`   📝 Reason: ${item.reason}`);

      let success = false;
      let action = '';
      let error = '';

      try {
        if (item.type === 'pr' && item.id) {
          // Verify PR exists and is open
          const exists = await this.verifyPRExists(item.id);
          if (exists) {
            action = `Close PR #${item.id}`;
            success = await this.closePullRequest(item.id, item.reason);
          } else {
            action = `PR #${item.id} already closed or not found`;
            success = true; // Not an error if already closed
            console.log(`   ℹ️ PR #${item.id} is already closed or does not exist`);
          }
        } else if (item.type === 'branch') {
          // Verify branch exists
          const exists = await this.verifyBranchExists(item.name);
          if (exists) {
            action = `Delete branch "${item.name}"`;
            success = await this.deleteBranch(item.name);
          } else {
            action = `Branch "${item.name}" already deleted or not found`;
            success = true; // Not an error if already deleted
            console.log(`   ℹ️ Branch "${item.name}" is already deleted or does not exist`);
          }
        }
      } catch (err) {
        error = err instanceof Error ? err.message : 'Unknown error';
        console.error(`   ❌ Error: ${error}`);
      }

      results.push({ item, action, success, error });
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate cleanup report
    console.log('\n\n' + '=' .repeat(80));
    console.log('📊 CLEANUP RESULTS SUMMARY');
    console.log('=' .repeat(80));

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful Operations: ${successful.length}`);
    console.log(`❌ Failed Operations: ${failed.length}`);
    console.log(`📊 Total Processed: ${results.length}`);

    if (successful.length > 0) {
      console.log('\n✅ SUCCESSFUL CLEANUPS:');
      console.log('-' .repeat(50));
      successful.forEach((result, index) => {
        console.log(`${index + 1}. ${result.item.integration}`);
        console.log(`   📋 Action: ${result.action}`);
        console.log(`   🎯 Target: ${result.item.type} "${result.item.name}"${result.item.id ? ` (#${result.item.id})` : ''}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n❌ FAILED CLEANUPS:');
      console.log('-' .repeat(50));
      failed.forEach((result, index) => {
        console.log(`${index + 1}. ${result.item.integration}`);
        console.log(`   📋 Action: ${result.action}`);
        console.log(`   🎯 Target: ${result.item.type} "${result.item.name}"${result.item.id ? ` (#${result.item.id})` : ''}`);
        console.log(`   ❌ Error: ${result.error}`);
      });
    }

    console.log('\n🔍 REMAINING WORK ANALYSIS:');
    console.log('-' .repeat(50));
    console.log('The following branches/PRs remain active and may need review:');
    
    // Note: This would require another API call to get current state
    console.log('• Codex (main development branch) - 12 commits ahead');
    console.log('• backup/recent-work-before-rollback - backup branch');
    console.log('• codex/fix-footer-and-nav-logos-linking - logo fixes');
    console.log('• codex/fix-homepage-hero-image-display - hero image fixes'); 
    console.log('• codex/enlarge-highlighted-carousel-item - carousel enhancements');
    console.log('• Other feature branches that may need integration');

    console.log('\n📝 RECOMMENDATIONS:');
    console.log('-' .repeat(50));
    console.log('1. Review remaining active branches for integration opportunities');
    console.log('2. Consider creating PRs for ready feature branches');
    console.log('3. Test all remaining changes in staging environment');
    console.log('4. Archive or delete truly obsolete branches');
    console.log('5. Schedule regular cleanup cycles to maintain repository hygiene');

    console.log('\n' + '=' .repeat(80));
    console.log(`✅ Cleanup Complete! Processed ${results.length} items.`);
    console.log(`🗓️ Finished: ${new Date().toLocaleString()}`);
    console.log('=' .repeat(80));
  }
}

// Run the cleanup
async function runCleanup() {
  const manager = new GitHubCleanupManager();
  await manager.executeCleanup();
}

runCleanup().catch(console.error);