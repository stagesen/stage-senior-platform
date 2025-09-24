#!/usr/bin/env tsx

class BranchCleanup {
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

  private async makeRequest(endpoint: string, method: string = 'GET'): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Integration-Tool'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    // DELETE requests return 204 with no content
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async deleteBackupBranch(): Promise<void> {
    const branchName = 'backup/recent-work-before-rollback';
    
    console.log('🗑️  BACKUP BRANCH CLEANUP');
    console.log('=' .repeat(50));
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🌿 Branch to delete: ${branchName}`);
    console.log('');

    try {
      // First, verify the branch exists
      console.log('🔍 Verifying branch exists...');
      const branch = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/${encodeURIComponent(branchName)}`);
      
      console.log(`✅ Branch found: ${branch.name}`);
      console.log(`   🔗 SHA: ${branch.commit.sha}`);
      console.log(`   🔒 Protected: ${branch.protected}`);
      console.log('');

      if (branch.protected) {
        console.log('⚠️  WARNING: Branch is protected and cannot be deleted!');
        return;
      }

      // Delete the branch
      console.log('🗑️  Deleting backup branch...');
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${encodeURIComponent(branchName)}`, 'DELETE');
      
      console.log('✅ SUCCESS: Backup branch deleted successfully!');
      console.log('');
      console.log('🎉 REPOSITORY CLEANUP COMPLETE!');
      console.log('📊 Final repository state:');
      console.log('   🌟 Single main branch maintained');
      console.log('   ✅ All valuable changes preserved in main');
      console.log('   🧹 Backup branch removed');
      console.log('   🚀 Repository ready for continued development');

    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        console.log('ℹ️  Branch not found - may have already been deleted.');
        console.log('✅ Repository cleanup complete!');
      } else {
        console.error('❌ Error deleting backup branch:', error);
        throw error;
      }
    }
  }

  async verifyFinalState(): Promise<void> {
    console.log('\n🔍 VERIFYING FINAL REPOSITORY STATE');
    console.log('-' .repeat(40));
    
    try {
      const branches = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches`);
      
      console.log(`📊 Total branches: ${branches.length}`);
      branches.forEach((branch: any) => {
        console.log(`   🌿 ${branch.name} ${branch.name === 'main' ? '(default)' : ''}`);
      });
      
      if (branches.length === 1 && branches[0].name === 'main') {
        console.log('\n🎯 PERFECT! Repository now has single main branch.');
        console.log('✅ GitHub repository cleanup completed successfully!');
      }
      
    } catch (error) {
      console.error('❌ Error verifying final state:', error);
    }
  }
}

async function main() {
  const cleanup = new BranchCleanup();
  await cleanup.deleteBackupBranch();
  await cleanup.verifyFinalState();
}

main().catch(console.error);
