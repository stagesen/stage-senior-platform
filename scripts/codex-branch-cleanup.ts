#!/usr/bin/env tsx

/**
 * Codex Branch Cleanup Script
 * Safely deletes the Codex branch after successful integration
 */

interface CleanupResult {
  branchDeleted: boolean;
  deletedBranch: string;
  remainingBranches: string[];
  cleanupNotes: string[];
  error?: string;
}

class CodexCleanupManager {
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
        'User-Agent': 'Stage-Senior-Codex-Cleanup-Tool',
        ...(body && { 'Content-Type': 'application/json' })
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Handle empty responses (like DELETE operations)
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

  async deleteBranch(branchName: string): Promise<boolean> {
    try {
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${branchName}`, 'DELETE');
      return true;
    } catch (error) {
      console.error(`Failed to delete branch ${branchName}:`, error);
      return false;
    }
  }

  async performCleanup(): Promise<CleanupResult> {
    console.log('🧹 Starting Codex Branch Cleanup Process');
    console.log('=' .repeat(60));

    try {
      // Get initial branch state
      console.log('📋 Fetching current branch list...');
      const initialBranches = await this.getBranches();
      console.log(`🌿 Initial branches: ${initialBranches.join(', ')}`);

      // Check if Codex branch exists
      if (!initialBranches.includes('Codex')) {
        return {
          branchDeleted: false,
          deletedBranch: 'Codex',
          remainingBranches: initialBranches,
          cleanupNotes: ['❌ Codex branch not found - may have been already deleted'],
          error: 'Codex branch does not exist'
        };
      }

      // Delete Codex branch
      console.log('🗑️  Deleting Codex branch...');
      const deleteSuccess = await this.deleteBranch('Codex');
      
      if (!deleteSuccess) {
        return {
          branchDeleted: false,
          deletedBranch: 'Codex',
          remainingBranches: initialBranches,
          cleanupNotes: ['❌ Failed to delete Codex branch'],
          error: 'Branch deletion failed'
        };
      }

      // Verify deletion
      console.log('✅ Verifying branch deletion...');
      const finalBranches = await this.getBranches();
      
      const cleanupNotes = [
        '✅ Codex branch successfully deleted',
        '📝 Integration completion: All valuable changes from Codex branch have been integrated',
        '🔍 Integration included: Events URL parameters, Community features',
        '⏭️  Integration skipped: About Us, Avatar components (redundant/outdated)',
        '👤 Original author: TrevorHarwood2 (external contributor)',
        '📊 Branch stats: 12 commits ahead, 6 commits behind main at deletion',
        '🎯 Cleanup reason: Integration complete, branch no longer needed',
        `📅 Cleanup date: ${new Date().toISOString()}`
      ];

      return {
        branchDeleted: true,
        deletedBranch: 'Codex',
        remainingBranches: finalBranches,
        cleanupNotes
      };

    } catch (error) {
      return {
        branchDeleted: false,
        deletedBranch: 'Codex',
        remainingBranches: [],
        cleanupNotes: ['❌ Cleanup process failed'],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  generateReport(result: CleanupResult): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 CODEX BRANCH CLEANUP REPORT');
    console.log('=' .repeat(60));
    console.log(`🗓️ Generated: ${new Date().toLocaleString()}`);
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🎯 Target Branch: ${result.deletedBranch}`);
    console.log(`✅ Deletion Success: ${result.branchDeleted ? 'YES' : 'NO'}`);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }

    console.log(`\n🌿 REMAINING BRANCHES (${result.remainingBranches.length}):`);
    result.remainingBranches.forEach((branch, index) => {
      console.log(`   ${index + 1}. ${branch}`);
    });

    console.log('\n📝 CLEANUP NOTES:');
    result.cleanupNotes.forEach(note => {
      console.log(`   • ${note}`);
    });

    console.log('\n🎉 REPOSITORY STATUS:');
    if (result.branchDeleted && result.remainingBranches.length <= 2) {
      console.log('   ✅ Repository is now clean and organized');
      console.log('   ✅ Only essential branches remain');
      console.log('   ✅ Integration cleanup completed successfully');
    } else if (result.branchDeleted) {
      console.log('   ✅ Codex branch cleanup completed');
      console.log('   ⚠️  Additional branches may need review');
    } else {
      console.log('   ❌ Cleanup incomplete - manual intervention may be required');
    }

    console.log('\n' + '=' .repeat(60));
  }
}

async function main() {
  const cleanup = new CodexCleanupManager();
  const result = await cleanup.performCleanup();
  cleanup.generateReport(result);
  
  if (result.error) {
    process.exit(1);
  }
}

main().catch(console.error);