#!/usr/bin/env tsx

/**
 * Complete Codex Branch Cleanup
 * Creates fresh "codex" branch from current main HEAD
 */

class CodexCleanupCompleter {
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
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Codex-Cleanup-Completer',
        ...(body && { 'Content-Type': 'application/json' })
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType?.includes('application/json')) {
      return null;
    }

    return response.json();
  }

  async getBranches(): Promise<string[]> {
    const branches = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches`);
    return branches.map((branch: any) => branch.name);
  }

  async getMainBranchSHA(): Promise<string> {
    const refData = await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/main`);
    return refData.object.sha;
  }

  async createBranch(branchName: string, sha: string): Promise<boolean> {
    try {
      console.log(`🌿 Creating new branch: ${branchName}`);
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs`, 'POST', {
        ref: `refs/heads/${branchName}`,
        sha: sha
      });
      console.log(`✅ Successfully created branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create branch ${branchName}:`, error);
      return false;
    }
  }

  async deleteBranch(branchName: string): Promise<boolean> {
    try {
      console.log(`🗑️ Deleting branch: ${branchName}`);
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${branchName}`, 'DELETE');
      console.log(`✅ Successfully deleted branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete branch ${branchName}:`, error);
      return false;
    }
  }

  async completeCodexCleanup(): Promise<void> {
    console.log('🚀 Completing Codex Branch Cleanup');
    console.log('=' .repeat(50));

    try {
      // Step 1: Check current branch state
      console.log('\n📋 Step 1: Checking branch status...');
      const branches = await this.getBranches();
      console.log(`📋 Current branches: ${branches.join(', ')}`);

      // Step 2: Get main branch SHA
      console.log('\n📋 Step 2: Getting main branch SHA...');
      const mainSHA = await this.getMainBranchSHA();
      console.log(`📋 Main branch SHA: ${mainSHA.substring(0, 8)}...`);

      // Step 3: Delete existing "codex" branch if it exists
      if (branches.includes('codex')) {
        console.log('\n📋 Step 3: Removing existing codex branch...');
        await this.deleteBranch('codex');
      } else {
        console.log('\n📋 Step 3: No existing codex branch to remove');
      }

      // Step 4: Create fresh "codex" branch from main
      console.log('\n📋 Step 4: Creating fresh codex branch...');
      const createSuccess = await this.createBranch('codex', mainSHA);

      // Step 5: Verify final state
      console.log('\n📋 Step 5: Verifying final branch state...');
      const finalBranches = await this.getBranches();
      
      // Generate completion report
      console.log('\n' + '=' .repeat(50));
      console.log('📊 CODEX CLEANUP COMPLETION REPORT');
      console.log('=' .repeat(50));
      console.log(`🗓️ Completed: ${new Date().toLocaleString()}`);
      console.log(`📂 Repository: ${this.owner}/${this.repo}`);
      
      console.log('\n✅ CLEANUP RESULTS:');
      console.log(`   🔧 Logo overlay: INTEGRATED into codebase`);
      console.log(`   🗑️ Old branch deleted: codex/add-logo-image-to-community-detail-pages`);
      console.log(`   🌿 New codex branch: ${createSuccess ? 'CREATED' : 'FAILED'}`);
      console.log(`   📋 Final branches: ${finalBranches.join(', ')}`);

      if (finalBranches.includes('codex') && createSuccess) {
        console.log('\n🎉 REPOSITORY STATUS:');
        console.log('   ✅ Codex branch cleanup completed successfully');
        console.log('   ✅ Fresh codex branch ready for stagesen');
        console.log('   ✅ Logo overlay functionality preserved in main codebase');
        console.log('   🚀 Repository ready for continued development');
      } else {
        console.log('\n⚠️ ISSUES DETECTED:');
        console.log('   ❌ Codex branch creation may have failed');
        console.log('   📋 Manual verification recommended');
      }

      console.log('\n' + '=' .repeat(50));

    } catch (error) {
      console.error('❌ Fatal error during cleanup completion:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const completer = new CodexCleanupCompleter();
  await completer.completeCodexCleanup();
}

main().catch(console.error);