#!/usr/bin/env tsx

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

interface CreateBranchRequest {
  ref: string; // Must be full ref like "refs/heads/branch-name"
  sha: string; // SHA to point the branch to
}

class CodexBranchCreator {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';
  private branchName: string = 'codex-main';

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    const config: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Codex-Branch-Creator',
        'Content-Type': 'application/json'
      }
    };

    if (body && method === 'POST') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json();
  }

  async getMainBranch(): Promise<string> {
    console.log('🔍 Getting repository default branch...');
    const repo = await this.makeRequest(`/repos/${this.owner}/${this.repo}`);
    console.log(`✅ Default branch: ${repo.default_branch}`);
    return repo.default_branch;
  }

  async getMainBranchSHA(mainBranch: string): Promise<string> {
    console.log(`🔍 Getting SHA for branch: ${mainBranch}...`);
    const branch = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/${mainBranch}`);
    console.log(`✅ SHA: ${branch.commit.sha}`);
    return branch.commit.sha;
  }

  async checkBranchExists(branchName: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking if branch '${branchName}' exists...`);
      await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/${branchName}`);
      console.log(`✅ Branch '${branchName}' already exists`);
      return true;
    } catch (error) {
      console.log(`ℹ️  Branch '${branchName}' does not exist yet`);
      return false;
    }
  }

  async createBranch(branchName: string, sha: string): Promise<any> {
    console.log(`🌿 Creating branch: ${branchName} from SHA: ${sha.substring(0, 8)}...`);
    
    // Try the git refs API first
    try {
      const createBranchData: CreateBranchRequest = {
        ref: `refs/heads/${branchName}`,
        sha: sha
      };

      const newBranch = await this.makeRequest(
        `/repos/${this.owner}/${this.repo}/git/refs`, 
        'POST', 
        createBranchData
      );

      console.log(`✅ Branch created successfully using git refs API!`);
      return newBranch;
    } catch (error) {
      console.log(`⚠️  Git refs API failed, trying alternative approach...`);
      console.log(`   Error: ${error}`);
      
      // Alternative approach: Use merge API with no-op merge
      try {
        // First, let's try creating a simple commit to force branch creation
        const currentTime = new Date().toISOString();
        const commitMessage = `Initialize codex branch - ${currentTime}`;
        
        // Create a tree based on main branch
        const mainBranchData = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/main`);
        const baseTreeSha = mainBranchData.commit.commit.tree.sha;
        
        // Create a new commit
        const commitData = {
          message: commitMessage,
          tree: baseTreeSha,
          parents: [sha],
          author: {
            name: "Replit Agent",
            email: "agent@replit.com",
            date: currentTime
          },
          committer: {
            name: "Replit Agent", 
            email: "agent@replit.com",
            date: currentTime
          }
        };
        
        const commit = await this.makeRequest(
          `/repos/${this.owner}/${this.repo}/git/commits`,
          'POST',
          commitData
        );
        
        // Now create the branch pointing to this commit
        const createRefData = {
          ref: `refs/heads/${branchName}`,
          sha: commit.sha
        };
        
        const newBranch = await this.makeRequest(
          `/repos/${this.owner}/${this.repo}/git/refs`,
          'POST',
          createRefData
        );
        
        console.log(`✅ Branch created successfully using commit approach!`);
        return newBranch;
        
      } catch (secondError) {
        console.log(`❌ Alternative approach also failed: ${secondError}`);
        throw new Error(`Failed to create branch using both methods. Original error: ${error}. Second error: ${secondError}`);
      }
    }
  }

  async verifyBranch(branchName: string): Promise<GitHubBranch> {
    console.log(`🔍 Verifying branch: ${branchName}...`);
    const branch = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches/${branchName}`);
    console.log(`✅ Branch verified successfully!`);
    return branch;
  }

  async createCodexBranch(): Promise<void> {
    console.log('🚀 Starting Codex Branch Creation Process');
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🌿 Target Branch: ${this.branchName}\n`);

    try {
      // Step 1: Get main branch name
      const mainBranch = await this.getMainBranch();

      // Step 2: Check if codex branch already exists
      const branchExists = await this.checkBranchExists(this.branchName);
      if (branchExists) {
        console.log(`⚠️  Branch '${this.branchName}' already exists!`);
        console.log('🔍 Verifying existing branch details...\n');
        
        const existingBranch = await this.verifyBranch(this.branchName);
        console.log('📊 EXISTING BRANCH DETAILS');
        console.log('-'.repeat(40));
        console.log(`🌿 Name: ${existingBranch.name}`);
        console.log(`🔗 SHA: ${existingBranch.commit.sha}`);
        console.log(`🔒 Protected: ${existingBranch.protected ? 'Yes' : 'No'}`);
        console.log(`🌐 URL: https://github.com/${this.owner}/${this.repo}/tree/${this.branchName}`);
        
        console.log('\n✅ Branch is ready for stagesen to use!');
        return;
      }

      // Step 3: Get current main branch SHA
      const mainBranchSHA = await this.getMainBranchSHA(mainBranch);

      // Step 4: Create the new branch
      const newBranch = await this.createBranch(this.branchName, mainBranchSHA);

      // Step 5: Verify the branch was created
      const verifiedBranch = await this.verifyBranch(this.branchName);

      // Step 6: Display success information
      console.log('\n' + '='.repeat(60));
      console.log('🎉 CODEX BRANCH CREATED SUCCESSFULLY!');
      console.log('='.repeat(60));
      console.log(`🌿 Branch Name: ${this.branchName}`);
      console.log(`🔗 SHA: ${verifiedBranch.commit.sha}`);
      console.log(`📍 Based on: ${mainBranch} (${mainBranchSHA.substring(0, 8)})`);
      console.log(`🔒 Protected: ${verifiedBranch.protected ? 'Yes' : 'No'}`);
      console.log(`🌐 GitHub URL: https://github.com/${this.owner}/${this.repo}/tree/${this.branchName}`);
      console.log(`👤 Ready for: stagesen`);
      
      console.log('\n📋 NEXT STEPS FOR STAGESEN:');
      console.log('1. Clone or pull latest changes from repository');
      console.log(`2. Switch to the codex branch: git checkout ${this.branchName}`);
      console.log('3. Start development work on the codex branch');
      console.log('4. Create feature branches from codex as needed');
      
      console.log('\n✅ Branch creation process completed successfully!');

    } catch (error) {
      console.error('❌ Error creating codex branch:', error);
      throw error;
    }
  }
}

// Run the branch creation
async function main() {
  const creator = new CodexBranchCreator();
  await creator.createCodexBranch();
}

main().catch(console.error);