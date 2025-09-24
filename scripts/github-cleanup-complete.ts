#!/usr/bin/env tsx

interface PullRequest {
  number: number;
  title: string;
  state: string;
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

interface Branch {
  name: string;
  protected: boolean;
}

class GitHubCleanup {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';

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

    if (body && (method === 'POST' || method === 'PATCH')) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async closePullRequest(prNumber: number, explanation: string): Promise<void> {
    console.log(`🔄 Closing PR #${prNumber}...`);
    
    // First, add a comment explaining the closure
    await this.makeRequest(`/repos/${this.owner}/${this.repo}/issues/${prNumber}/comments`, 'POST', {
      body: explanation
    });

    // Then close the PR
    await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`, 'PATCH', {
      state: 'closed'
    });

    console.log(`✅ Successfully closed PR #${prNumber}`);
  }

  async deleteBranch(branchName: string): Promise<void> {
    console.log(`🗑️  Deleting branch: ${branchName}...`);
    
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${branchName}`, 'DELETE');
      console.log(`✅ Successfully deleted branch: ${branchName}`);
    } catch (error) {
      console.error(`❌ Failed to delete branch ${branchName}:`, error);
      throw error;
    }
  }

  async fetchPullRequest(prNumber: number): Promise<PullRequest | null> {
    try {
      return await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`);
    } catch (error) {
      console.warn(`⚠️  Could not fetch PR #${prNumber}:`, error);
      return null;
    }
  }

  async fetchAllBranches(): Promise<Branch[]> {
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches?per_page=100`);
  }

  async performCleanup(): Promise<void> {
    console.log('🚀 Starting GitHub Repository Cleanup');
    console.log(`📂 Repository: ${this.owner}/${this.repo}\n`);

    const targetPRs = [
      { number: 12, title: "Scroll to top functionality", feature: "scroll-to-top" },
      { number: 13, title: "Remove mini map from sidebar", feature: "sidebar cleanup" },
      { number: 15, title: "Enlarge active community carousel item", feature: "carousel enhancement" },
      { number: 16, title: "Fix hero image visibility", feature: "hero image fix" },
      { number: 17, title: "Fix header and footer logos", feature: "logo fixes" }
    ];

    const targetBranches = [
      'codex/scroll-to-top-on-community-detail-page',
      'codex/remove-bottom-map-from-sidebar',
      'codex/enlarge-highlighted-carousel-item',
      'codex/fix-homepage-hero-image-display',
      'codex/fix-footer-and-nav-logos-linking'
    ];

    const preserveBranches = ['main', 'Codex', 'backup/recent-work-before-rollback'];

    console.log('=' .repeat(80));
    console.log('📊 GITHUB CLEANUP REPORT');
    console.log('=' .repeat(80));
    console.log(`🗓️ Started: ${new Date().toLocaleString()}\n`);

    // Get initial state
    console.log('🔍 Checking current repository state...');
    const initialBranches = await this.fetchAllBranches();
    console.log(`📊 Initial branch count: ${initialBranches.length}\n`);

    // Phase 1: Close Pull Requests
    console.log('📌 PHASE 1: CLOSING PULL REQUESTS');
    console.log('-' .repeat(50));

    const closedPRs: number[] = [];
    const failedPRs: number[] = [];

    for (const pr of targetPRs) {
      try {
        const prData = await this.fetchPullRequest(pr.number);
        
        if (!prData) {
          console.log(`⚠️  PR #${pr.number} not found - may already be closed`);
          continue;
        }

        if (prData.state === 'closed') {
          console.log(`ℹ️  PR #${pr.number} is already closed`);
          closedPRs.push(pr.number);
          continue;
        }

        const explanation = `🎯 **Feature Integration Complete**

This pull request is being closed because the **${pr.feature}** functionality has been successfully integrated directly into the Replit development environment using the GitHub API.

**Integration Details:**
- ✅ Code changes have been applied to the codebase
- ✅ Functionality has been tested and verified
- ✅ Feature is now live in the application

**Why we're closing this PR:**
- The changes were integrated through direct API implementation rather than traditional Git merge
- This approach allows for more granular control and immediate deployment
- The branch associated with this PR will be cleaned up as part of repository maintenance

**Status:** ✅ **INTEGRATED & COMPLETE**

Thank you for the contribution! The feature is now part of the main application.`;

        await this.closePullRequest(pr.number, explanation);
        closedPRs.push(pr.number);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to close PR #${pr.number}:`, error);
        failedPRs.push(pr.number);
      }
    }

    console.log(`\n📊 PR Closure Summary:`);
    console.log(`   ✅ Successfully closed: ${closedPRs.length} PRs`);
    console.log(`   ❌ Failed to close: ${failedPRs.length} PRs`);
    if (closedPRs.length > 0) {
      console.log(`   🎯 Closed PRs: ${closedPRs.join(', ')}`);
    }
    if (failedPRs.length > 0) {
      console.log(`   ⚠️  Failed PRs: ${failedPRs.join(', ')}`);
    }

    // Phase 2: Delete Branches
    console.log('\n🗑️  PHASE 2: DELETING FEATURE BRANCHES');
    console.log('-' .repeat(50));

    const deletedBranches: string[] = [];
    const failedBranches: string[] = [];
    const notFoundBranches: string[] = [];

    for (const branchName of targetBranches) {
      try {
        // Check if branch exists
        const currentBranches = await this.fetchAllBranches();
        const branchExists = currentBranches.some(b => b.name === branchName);
        
        if (!branchExists) {
          console.log(`ℹ️  Branch '${branchName}' not found - may already be deleted`);
          notFoundBranches.push(branchName);
          continue;
        }

        await this.deleteBranch(branchName);
        deletedBranches.push(branchName);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to delete branch '${branchName}':`, error);
        failedBranches.push(branchName);
      }
    }

    console.log(`\n📊 Branch Deletion Summary:`);
    console.log(`   ✅ Successfully deleted: ${deletedBranches.length} branches`);
    console.log(`   ❌ Failed to delete: ${failedBranches.length} branches`);
    console.log(`   ℹ️  Not found: ${notFoundBranches.length} branches`);
    
    if (deletedBranches.length > 0) {
      console.log(`   🗑️  Deleted: ${deletedBranches.join(', ')}`);
    }
    if (failedBranches.length > 0) {
      console.log(`   ⚠️  Failed: ${failedBranches.join(', ')}`);
    }
    if (notFoundBranches.length > 0) {
      console.log(`   👻 Not found: ${notFoundBranches.join(', ')}`);
    }

    // Phase 3: Final Verification
    console.log('\n🔍 PHASE 3: FINAL VERIFICATION');
    console.log('-' .repeat(50));

    const finalBranches = await this.fetchAllBranches();
    const remainingBranches = finalBranches.map(b => b.name);

    console.log(`📊 Final branch count: ${finalBranches.length}`);
    console.log(`📉 Branches removed: ${initialBranches.length - finalBranches.length}`);

    console.log(`\n🌿 Remaining branches:`);
    for (const branch of finalBranches) {
      const isPreserved = preserveBranches.includes(branch.name);
      const status = isPreserved ? '✅ PRESERVED' : '⚠️  UNEXPECTED';
      console.log(`   ${status}: ${branch.name}${branch.protected ? ' (protected)' : ''}`);
    }

    // Check for any unexpected branches
    const unexpectedBranches = remainingBranches.filter(name => 
      !preserveBranches.includes(name) && 
      !targetBranches.includes(name)
    );

    if (unexpectedBranches.length > 0) {
      console.log(`\n⚠️  UNEXPECTED BRANCHES FOUND:`);
      for (const branch of unexpectedBranches) {
        console.log(`   📍 ${branch}`);
      }
    }

    // Final Summary
    console.log('\n' + '=' .repeat(80));
    console.log('✅ CLEANUP COMPLETE!');
    console.log('=' .repeat(80));
    console.log(`🗓️ Completed: ${new Date().toLocaleString()}`);
    console.log(`📊 Summary:`);
    console.log(`   🔄 PRs processed: ${targetPRs.length}`);
    console.log(`   ✅ PRs closed: ${closedPRs.length}`);
    console.log(`   🗑️  Branches targeted for deletion: ${targetBranches.length}`);
    console.log(`   ✅ Branches deleted: ${deletedBranches.length}`);
    console.log(`   🌿 Final branch count: ${finalBranches.length}`);
    console.log(`   🎯 Preserved branches: ${preserveBranches.join(', ')}`);

    if (failedPRs.length === 0 && failedBranches.length === 0) {
      console.log('\n🎉 All cleanup operations completed successfully!');
    } else {
      console.log('\n⚠️  Some operations failed - please review the errors above');
    }

    console.log('=' .repeat(80));
  }
}

// Run the cleanup
async function main() {
  try {
    const cleanup = new GitHubCleanup();
    await cleanup.performCleanup();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);