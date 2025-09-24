#!/usr/bin/env tsx

/**
 * Codex Branch Merge and Cleanup Script
 * Merges existing codex/add-logo-image-to-community-detail-pages branch changes,
 * deletes the old branch, and creates a fresh "codex" branch for stagesen
 */

interface CommitInfo {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    id: number;
  } | null;
}

interface FileChange {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
  contents_url: string;
  raw_url: string;
}

interface MergeCompareData {
  ahead_by: number;
  behind_by: number;
  commits: CommitInfo[];
  files: FileChange[];
}

interface IntegrationResult {
  success: boolean;
  filesProcessed: number;
  errors: string[];
  appliedChanges: {
    filename: string;
    status: string;
    content?: string;
  }[];
}

class CodexBranchMergeManager {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';
  
  private existingBranch: string = 'codex/add-logo-image-to-community-detail-pages';
  private newBranch: string = 'codex';
  private baseBranch: string = 'main';

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
        'User-Agent': 'Stage-Senior-Codex-Merge-Tool',
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

  private async fetchFileContent(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Stage-Senior-Codex-Merge-Tool'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content from ${url}: ${response.status}`);
    }

    return response.text();
  }

  async getBranches(): Promise<string[]> {
    const branches = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches`);
    return branches.map((branch: any) => branch.name);
  }

  async getBranchComparison(): Promise<MergeCompareData> {
    console.log(`🔍 Comparing ${this.baseBranch}...${this.existingBranch}`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/compare/${this.baseBranch}...${this.existingBranch}`);
  }

  async fetchChangesFromBranch(): Promise<MergeCompareData> {
    console.log('📋 Fetching changes from codex branch...');
    
    try {
      const compareData = await this.getBranchComparison();
      
      console.log(`📊 Branch Analysis:`);
      console.log(`   📈 Commits ahead: ${compareData.ahead_by}`);
      console.log(`   📉 Commits behind: ${compareData.behind_by}`);
      console.log(`   📁 Files changed: ${compareData.files.length}`);

      if (compareData.ahead_by === 0) {
        console.log('✅ Branch is up to date - no changes to integrate');
        return compareData;
      }

      // Log commits to be integrated
      console.log('\n📝 Commits to integrate:');
      compareData.commits.forEach((commit, index) => {
        const shortMessage = commit.commit.message.split('\n')[0];
        console.log(`   ${index + 1}. ${commit.sha.substring(0, 8)} - ${shortMessage}`);
        console.log(`      Author: ${commit.commit.author.name} (${commit.author?.login || 'unknown'})`);
      });

      // Log files to be changed
      console.log('\n📁 Files to be integrated:');
      compareData.files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.filename} (${file.status})`);
        console.log(`      Changes: +${file.additions} -${file.deletions}`);
      });

      return compareData;
    } catch (error) {
      console.error('❌ Error fetching branch changes:', error);
      throw error;
    }
  }

  private isFileRelevant(filename: string): boolean {
    // Focus on community detail pages and logo overlay functionality
    const relevantPatterns = [
      'community-detail',
      'logo',
      'hero',
      'overlay',
      'community',
      '.tsx',
      '.ts',
      '.css'
    ];
    
    return relevantPatterns.some(pattern => 
      filename.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private applyFileChange(filename: string, content: string, status: string): void {
    const fs = require('fs');
    const path = require('path');
    
    try {
      if (status === 'removed') {
        if (fs.existsSync(filename)) {
          fs.unlinkSync(filename);
          console.log(`   ✅ Removed: ${filename}`);
        }
        return;
      }

      // Ensure directory exists
      const dirname = path.dirname(filename);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }

      // Write file content
      fs.writeFileSync(filename, content, 'utf8');
      console.log(`   ✅ ${status === 'added' ? 'Added' : 'Updated'}: ${filename}`);
    } catch (error) {
      console.error(`   ❌ Failed to ${status} ${filename}:`, error);
      throw error;
    }
  }

  async integrateChanges(compareData: MergeCompareData): Promise<IntegrationResult> {
    console.log('\n🔧 Starting integration process...');
    
    const result: IntegrationResult = {
      success: true,
      filesProcessed: 0,
      errors: [],
      appliedChanges: []
    };

    if (compareData.files.length === 0) {
      console.log('✅ No files to integrate');
      return result;
    }

    // Filter for relevant files
    const relevantFiles = compareData.files.filter(file => this.isFileRelevant(file.filename));
    
    console.log(`📋 Processing ${relevantFiles.length} relevant files out of ${compareData.files.length} total...`);

    for (const file of relevantFiles) {
      try {
        console.log(`\n🔧 Processing: ${file.filename} (${file.status})`);
        
        if (file.status === 'removed') {
          this.applyFileChange(file.filename, '', file.status);
        } else {
          // Fetch file content from the branch
          const content = await this.fetchFileContent(file.raw_url);
          this.applyFileChange(file.filename, content, file.status);
        }

        result.appliedChanges.push({
          filename: file.filename,
          status: file.status,
          content: file.status !== 'removed' ? 'content applied' : undefined
        });
        result.filesProcessed++;

      } catch (error) {
        const errorMessage = `Failed to process ${file.filename}: ${error}`;
        console.error(`   ❌ ${errorMessage}`);
        result.errors.push(errorMessage);
        result.success = false;
      }
    }

    console.log(`\n✅ Integration complete:`);
    console.log(`   📁 Files processed: ${result.filesProcessed}`);
    console.log(`   ❌ Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Integration errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    return result;
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

  async createBranch(branchName: string, fromBranch: string = 'main'): Promise<boolean> {
    try {
      console.log(`🌿 Creating new branch: ${branchName} from ${fromBranch}`);
      
      // Get the SHA of the source branch
      const refData = await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs/heads/${fromBranch}`);
      const sourceSha = refData.object.sha;

      // Create new branch
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/git/refs`, 'POST', {
        ref: `refs/heads/${branchName}`,
        sha: sourceSha
      });

      console.log(`✅ Successfully created branch: ${branchName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create branch ${branchName}:`, error);
      return false;
    }
  }

  async performCompleteWorkflow(): Promise<void> {
    console.log('🚀 Starting Codex Branch Merge and Cleanup Process');
    console.log('=' .repeat(60));
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🎯 Source branch: ${this.existingBranch}`);
    console.log(`🎯 Target branch: ${this.newBranch}`);
    console.log(`🎯 Base branch: ${this.baseBranch}`);

    try {
      // Step 1: Check if branches exist
      console.log('\n📋 Step 1: Checking branch status...');
      const branches = await this.getBranches();
      
      if (!branches.includes(this.existingBranch)) {
        console.log(`❌ Source branch ${this.existingBranch} not found`);
        console.log(`📋 Available branches: ${branches.join(', ')}`);
        return;
      }

      if (branches.includes(this.newBranch)) {
        console.log(`⚠️ Target branch ${this.newBranch} already exists - will be deleted and recreated`);
      }

      // Step 2: Fetch changes from existing branch
      console.log('\n📋 Step 2: Fetching changes from existing branch...');
      const compareData = await this.fetchChangesFromBranch();

      // Step 3: Integrate changes into current codebase
      console.log('\n📋 Step 3: Integrating changes...');
      const integrationResult = await this.integrateChanges(compareData);

      if (!integrationResult.success) {
        console.log('❌ Integration failed - aborting workflow');
        return;
      }

      // Step 4: Delete existing codex branch (if integration was successful)
      console.log('\n📋 Step 4: Cleaning up existing branch...');
      const deleteSuccess = await this.deleteBranch(this.existingBranch);

      if (!deleteSuccess) {
        console.log('⚠️ Failed to delete existing branch - continuing anyway');
      }

      // Step 5: Delete existing "codex" branch if it exists
      if (branches.includes(this.newBranch)) {
        console.log('\n📋 Step 5a: Removing existing codex branch...');
        await this.deleteBranch(this.newBranch);
      }

      // Step 6: Create fresh "codex" branch
      console.log('\n📋 Step 6: Creating fresh codex branch...');
      const createSuccess = await this.createBranch(this.newBranch, this.baseBranch);

      // Step 7: Generate summary report
      console.log('\n' + '=' .repeat(60));
      console.log('📊 CODEX BRANCH MERGE CLEANUP REPORT');
      console.log('=' .repeat(60));
      console.log(`🗓️ Completed: ${new Date().toLocaleString()}`);
      console.log(`📂 Repository: ${this.owner}/${this.repo}`);
      
      console.log('\n✅ WORKFLOW RESULTS:');
      console.log(`   🔍 Changes fetched: ${compareData.ahead_by} commits, ${compareData.files.length} files`);
      console.log(`   🔧 Integration: ${integrationResult.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`   📁 Files processed: ${integrationResult.filesProcessed}`);
      console.log(`   🗑️ Old branch deleted: ${deleteSuccess ? 'YES' : 'NO'}`);
      console.log(`   🌿 New branch created: ${createSuccess ? 'YES' : 'NO'}`);

      if (integrationResult.appliedChanges.length > 0) {
        console.log('\n📋 APPLIED CHANGES:');
        integrationResult.appliedChanges.forEach((change, index) => {
          console.log(`   ${index + 1}. ${change.filename} (${change.status})`);
        });
      }

      console.log('\n🎉 REPOSITORY STATUS:');
      if (integrationResult.success && createSuccess) {
        console.log('   ✅ Codex branch cleanup completed successfully');
        console.log('   ✅ Logo overlay changes integrated');
        console.log('   ✅ Fresh codex branch ready for stagesen');
        console.log('   🚀 Repository is ready for continued development');
      } else {
        console.log('   ⚠️ Workflow completed with issues - review above');
      }

      console.log('\n' + '=' .repeat(60));

    } catch (error) {
      console.error('❌ Fatal error during workflow:', error);
      throw error;
    }
  }
}

// Main execution
async function mergeMain() {
  const manager = new CodexBranchMergeManager();
  await manager.performCompleteWorkflow();
}

mergeMain().catch(console.error);