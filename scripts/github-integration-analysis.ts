#!/usr/bin/env tsx

import { readFileSync } from 'fs';

interface Branch {
  name: string;
  commit: {
    sha: string;
    commit: {
      author: {
        name: string;
        date: string;
      };
      message: string;
    };
  };
  protected: boolean;
}

interface PullRequest {
  number: number;
  title: string;
  body: string;
  state: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  user: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  mergeable: boolean | null;
  mergeable_state: string;
  additions: number;
  deletions: number;
  changed_files: number;
  commits: number;
}

class GitHubIntegration {
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

  private async makeRequest(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Stage-Senior-Integration-Tool'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async fetchAllBranches(): Promise<Branch[]> {
    console.log('🔍 Fetching all repository branches...');
    const branches = await this.makeRequest(`/repos/${this.owner}/${this.repo}/branches?per_page=100`);
    
    // Get detailed commit info for each branch
    const branchDetails = await Promise.all(
      branches.map(async (branch: any) => {
        const commitDetails = await this.makeRequest(`/repos/${this.owner}/${this.repo}/commits/${branch.commit.sha}`);
        return {
          ...branch,
          commit: commitDetails
        };
      })
    );

    return branchDetails;
  }

  async fetchAllPullRequests(): Promise<PullRequest[]> {
    console.log('🔍 Fetching all open pull requests...');
    const prs = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls?state=open&per_page=100`);
    
    // Get additional details for each PR
    const prDetails = await Promise.all(
      prs.map(async (pr: any) => {
        const prDetail = await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${pr.number}`);
        return prDetail;
      })
    );

    return prDetails;
  }

  async getCompareInfo(baseBranch: string, headBranch: string): Promise<any> {
    try {
      return await this.makeRequest(`/repos/${this.owner}/${this.repo}/compare/${baseBranch}...${headBranch}`);
    } catch (error) {
      console.warn(`Could not compare ${baseBranch}...${headBranch}:`, error);
      return null;
    }
  }

  async getMainBranch(): Promise<string> {
    const repo = await this.makeRequest(`/repos/${this.owner}/${this.repo}`);
    return repo.default_branch;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  categorizeChanges(message: string): string[] {
    const categories: string[] = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
      categories.push('🐛 Bug Fix');
    }
    if (lowerMessage.includes('feat') || lowerMessage.includes('feature')) {
      categories.push('✨ Feature');
    }
    if (lowerMessage.includes('style') || lowerMessage.includes('css')) {
      categories.push('💄 Style');
    }
    if (lowerMessage.includes('refactor') || lowerMessage.includes('cleanup')) {
      categories.push('♻️ Refactor');
    }
    if (lowerMessage.includes('test')) {
      categories.push('🧪 Test');
    }
    if (lowerMessage.includes('docs') || lowerMessage.includes('documentation')) {
      categories.push('📚 Documentation');
    }
    if (lowerMessage.includes('config') || lowerMessage.includes('setup')) {
      categories.push('⚙️ Configuration');
    }

    return categories.length > 0 ? categories : ['🔄 Other'];
  }

  assessComplexity(pr: PullRequest): 'Low' | 'Medium' | 'High' {
    if (pr.changed_files <= 3 && pr.additions + pr.deletions <= 100) {
      return 'Low';
    }
    if (pr.changed_files <= 10 && pr.additions + pr.deletions <= 500) {
      return 'Medium';
    }
    return 'High';
  }

  async generateIntegrationReport(): Promise<void> {
    console.log('🚀 Starting GitHub Integration Analysis for Stage Senior Platform');
    console.log(`📂 Repository: ${this.owner}/${this.repo}\n`);

    try {
      const [branches, pullRequests, mainBranch] = await Promise.all([
        this.fetchAllBranches(),
        this.fetchAllPullRequests(),
        this.getMainBranch()
      ]);

      console.log('=' .repeat(80));
      console.log('📊 GITHUB INTEGRATION ANALYSIS REPORT');
      console.log('=' .repeat(80));
      console.log(`🗓️ Generated: ${new Date().toLocaleString()}`);
      console.log(`🌟 Main Branch: ${mainBranch}`);
      console.log(`🌿 Total Branches: ${branches.length}`);
      console.log(`🔄 Open Pull Requests: ${pullRequests.length}\n`);

      // BRANCH ANALYSIS
      console.log('🌿 BRANCH ANALYSIS');
      console.log('-' .repeat(50));

      const otherBranches = branches.filter(branch => branch.name !== mainBranch);
      
      if (otherBranches.length === 0) {
        console.log('✅ No additional branches found - repository is clean!\n');
      } else {
        for (const branch of otherBranches) {
          const categories = this.categorizeChanges(branch.commit.commit.message);
          const compareInfo = await this.getCompareInfo(mainBranch, branch.name);
          
          console.log(`\n📍 Branch: ${branch.name}`);
          console.log(`   🔗 SHA: ${branch.commit.sha.substring(0, 8)}`);
          console.log(`   👤 Author: ${branch.commit.commit.author.name}`);
          console.log(`   📅 Date: ${this.formatDate(branch.commit.commit.author.date)}`);
          console.log(`   💬 Message: ${branch.commit.commit.message.split('\n')[0]}`);
          console.log(`   🏷️  Categories: ${categories.join(', ')}`);
          
          if (compareInfo && compareInfo.ahead_by) {
            console.log(`   📈 Commits ahead of ${mainBranch}: ${compareInfo.ahead_by}`);
            console.log(`   📉 Commits behind ${mainBranch}: ${compareInfo.behind_by}`);
          }
          
          console.log(`   🔒 Protected: ${branch.protected ? 'Yes' : 'No'}`);
        }
      }

      // PULL REQUEST ANALYSIS
      console.log('\n\n🔄 PULL REQUEST ANALYSIS');
      console.log('-' .repeat(50));

      if (pullRequests.length === 0) {
        console.log('✅ No open pull requests found!\n');
      } else {
        // Sort PRs by complexity and date
        const sortedPRs = pullRequests.sort((a, b) => {
          const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          const aComplexity = this.assessComplexity(a);
          const bComplexity = this.assessComplexity(b);
          
          if (complexityOrder[aComplexity] !== complexityOrder[bComplexity]) {
            return complexityOrder[aComplexity] - complexityOrder[bComplexity];
          }
          
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        for (const pr of sortedPRs) {
          const categories = this.categorizeChanges(pr.title + ' ' + (pr.body || ''));
          const complexity = this.assessComplexity(pr);
          
          console.log(`\n🔄 PR #${pr.number}: ${pr.title}`);
          console.log(`   🌿 ${pr.head.ref} → ${pr.base.ref}`);
          console.log(`   👤 Author: ${pr.user.login}`);
          console.log(`   📅 Created: ${this.formatDate(pr.created_at)}`);
          console.log(`   📅 Updated: ${this.formatDate(pr.updated_at)}`);
          console.log(`   🏷️  Categories: ${categories.join(', ')}`);
          console.log(`   📊 Complexity: ${complexity}`);
          console.log(`   📝 Files changed: ${pr.changed_files}`);
          console.log(`   📈 Additions: ${pr.additions}`);
          console.log(`   📉 Deletions: ${pr.deletions}`);
          console.log(`   🔄 Commits: ${pr.commits}`);
          console.log(`   ✅ Mergeable: ${pr.mergeable === null ? 'Unknown' : pr.mergeable ? 'Yes' : 'No'}`);
          console.log(`   🚦 Status: ${pr.mergeable_state}`);
          
          if (pr.body && pr.body.trim()) {
            const bodyPreview = pr.body.substring(0, 200) + (pr.body.length > 200 ? '...' : '');
            console.log(`   📋 Description: ${bodyPreview.replace(/\n/g, ' ')}`);
          }
        }
      }

      // INTEGRATION RECOMMENDATIONS
      console.log('\n\n🎯 INTEGRATION RECOMMENDATIONS');
      console.log('-' .repeat(50));

      if (otherBranches.length === 0 && pullRequests.length === 0) {
        console.log('🎉 Repository is clean! No branches or PRs need integration.');
      } else {
        console.log('\n📋 Priority Order (Low complexity first):');
        
        // Combine PRs and branches for unified recommendations
        const items: Array<{type: 'pr' | 'branch', item: any, complexity: 'Low' | 'Medium' | 'High'}> = [];
        
        pullRequests.forEach(pr => {
          items.push({type: 'pr', item: pr, complexity: this.assessComplexity(pr)});
        });
        
        otherBranches.forEach(branch => {
          // Simple complexity assessment for branches
          const complexity: 'Low' | 'Medium' | 'High' = branch.name.includes('hotfix') || branch.name.includes('patch') ? 'Low' : 'Medium';
          items.push({type: 'branch', item: branch, complexity});
        });

        const sortedItems = items.sort((a, b) => {
          const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return complexityOrder[a.complexity] - complexityOrder[b.complexity];
        });

        let priority = 1;
        sortedItems.forEach(({type, item, complexity}) => {
          if (type === 'pr') {
            console.log(`\n${priority}. 🔄 PR #${item.number}: ${item.title}`);
            console.log(`   📊 Complexity: ${complexity} | 📝 ${item.changed_files} files | 🔄 ${item.commits} commits`);
            console.log(`   💡 Recommendation: ${complexity === 'Low' ? 'Safe to merge - low risk' : complexity === 'Medium' ? 'Review carefully - moderate changes' : 'High impact - thorough testing needed'}`);
          } else {
            console.log(`\n${priority}. 🌿 Branch: ${item.name}`);
            console.log(`   📊 Complexity: ${complexity} | 👤 ${item.commit.commit.author.name}`);
            console.log(`   💡 Recommendation: ${complexity === 'Low' ? 'Consider merging or creating PR' : 'Needs review and PR creation'}`);
          }
          priority++;
        });

        console.log('\n⚠️  INTEGRATION NOTES:');
        console.log('• Test all changes in staging environment first');
        console.log('• Review database migrations carefully');
        console.log('• Check for breaking changes in API endpoints');
        console.log('• Verify UI/UX consistency across all changes');
        console.log('• Update documentation after integration');
      }

      console.log('\n' + '=' .repeat(80));
      console.log('✅ Analysis Complete!');
      console.log('=' .repeat(80));

    } catch (error) {
      console.error('❌ Error during analysis:', error);
      throw error;
    }
  }
}

// Run the analysis
async function main() {
  const integration = new GitHubIntegration();
  await integration.generateIntegrationReport();
}

main().catch(console.error);