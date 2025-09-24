#!/usr/bin/env tsx

class BranchDiscovery {
  private token: string;
  private baseURL: string = 'https://api.github.com';
  private possibleOwners = ['stagesen', 'stage-senior', 'TrevorHarwood2'];
  private possibleRepos = ['stage-senior-platform', 'stage-senior', 'senior-platform'];

  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    if (!this.token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Branch-Discovery'
      }
    });

    if (!response.ok) {
      return { error: `${response.status} ${response.statusText}` };
    }

    return response.json();
  }

  async findRepository(): Promise<{ owner: string; repo: string } | null> {
    console.log('🔍 Searching for the correct repository...\n');
    
    for (const owner of this.possibleOwners) {
      for (const repo of this.possibleRepos) {
        console.log(`Checking ${owner}/${repo}...`);
        const result = await this.makeRequest(`/repos/${owner}/${repo}`);
        
        if (!result.error) {
          console.log(`✅ Found repository: ${owner}/${repo}`);
          console.log(`   Name: ${result.name}`);
          console.log(`   Description: ${result.description || 'No description'}`);
          console.log(`   Default branch: ${result.default_branch}`);
          console.log(`   Private: ${result.private}`);
          console.log(`   Last updated: ${new Date(result.updated_at).toLocaleString()}\n`);
          return { owner, repo };
        } else {
          console.log(`   ❌ ${result.error}`);
        }
      }
    }
    
    return null;
  }

  async findBranchesWithCodex(owner: string, repo: string): Promise<void> {
    console.log(`🌿 Searching for branches in ${owner}/${repo}...\n`);
    
    const branches = await this.makeRequest(`/repos/${owner}/${repo}/branches?per_page=100`);
    
    if (branches.error) {
      console.log(`❌ Error fetching branches: ${branches.error}`);
      return;
    }

    console.log(`Found ${branches.length} branches:`);
    
    branches.forEach((branch: any, index: number) => {
      const isCodexRelated = branch.name.toLowerCase().includes('codex') || 
                            branch.name.toLowerCase().includes('trevor') ||
                            branch.name.toLowerCase().includes('profile');
      
      console.log(`${index + 1}. ${branch.name}${isCodexRelated ? ' 🎯' : ''}`);
    });

    // Look for potential Codex branches
    const codexBranches = branches.filter((branch: any) => 
      branch.name.toLowerCase().includes('codex') || 
      branch.name.toLowerCase().includes('trevor') ||
      branch.name.toLowerCase().includes('profile')
    );

    if (codexBranches.length > 0) {
      console.log('\n🎯 POTENTIAL CODEX-RELATED BRANCHES:');
      for (const branch of codexBranches) {
        console.log(`\n📍 Branch: ${branch.name}`);
        
        // Get commit details
        const commitDetails = await this.makeRequest(`/repos/${owner}/${repo}/commits/${branch.commit.sha}`);
        if (!commitDetails.error) {
          console.log(`   👤 Author: ${commitDetails.commit.author.name}`);
          console.log(`   📅 Date: ${new Date(commitDetails.commit.author.date).toLocaleString()}`);
          console.log(`   💬 Message: ${commitDetails.commit.message.split('\n')[0]}`);
          
          // Check if this could be the Codex branch by looking at commit message
          if (commitDetails.commit.message.toLowerCase().includes('profile')) {
            console.log('   ✨ This could be the Codex branch (contains profile-related changes)');
          }
        }

        // Get comparison with main
        const compare = await this.makeRequest(`/repos/${owner}/${repo}/compare/main...${branch.name}`);
        if (!compare.error) {
          console.log(`   📈 Commits ahead of main: ${compare.ahead_by}`);
          console.log(`   📉 Commits behind main: ${compare.behind_by}`);
          
          if (compare.ahead_by === 12) {
            console.log('   🎉 THIS IS LIKELY THE CODEX BRANCH! (12 commits ahead)');
          }
        }
      }
    } else {
      console.log('\n⚠️  No obvious Codex-related branches found. Let me check all branches for the right characteristics...');
      
      // Check all branches for the "12 commits ahead" characteristic
      console.log('\n🔍 Checking all branches for 12 commits ahead of main...');
      
      for (const branch of branches) {
        if (branch.name === 'main' || branch.name === 'master') continue;
        
        const compare = await this.makeRequest(`/repos/${owner}/${repo}/compare/main...${branch.name}`);
        if (!compare.error && compare.ahead_by === 12) {
          console.log(`\n🎉 FOUND CANDIDATE: ${branch.name} (12 commits ahead)`);
          
          // Get latest commit details
          const commitDetails = await this.makeRequest(`/repos/${owner}/${repo}/commits/${branch.commit.sha}`);
          if (!commitDetails.error) {
            console.log(`   👤 Author: ${commitDetails.commit.author.name}`);
            console.log(`   💬 Latest commit: ${commitDetails.commit.message.split('\n')[0]}`);
            
            if (commitDetails.commit.message.toLowerCase().includes('profile')) {
              console.log('   ✅ CONFIRMED: Contains profile fix (matches task description)');
            }
          }
        }
      }
    }
  }

  async discoverCodexBranch(): Promise<void> {
    console.log('🚀 Starting Branch Discovery for Codex Integration');
    console.log('=' .repeat(60));

    try {
      // Step 1: Find the correct repository
      const repoInfo = await this.findRepository();
      
      if (!repoInfo) {
        console.log('❌ Could not find the repository. Please check the owner/repo names.');
        return;
      }

      // Step 2: Search for branches that could be the Codex branch
      await this.findBranchesWithCodex(repoInfo.owner, repoInfo.repo);

      console.log('\n' + '=' .repeat(60));
      console.log('✅ Branch Discovery Complete!');
      console.log('Please use the identified branch name for the Codex analysis.');

    } catch (error) {
      console.error('❌ Error during branch discovery:', error);
    }
  }
}

// Run the discovery
async function main() {
  const discovery = new BranchDiscovery();
  await discovery.discoverCodexBranch();
}

main().catch(console.error);