#!/usr/bin/env tsx

interface PullRequestFile {
  filename: string;
  status: string; // 'added', 'modified', 'removed', 'renamed'
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string; // The diff patch
  previous_filename?: string; // For renamed files
}

interface CommitDetails {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
  } | null;
}

interface BranchComparison {
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: CommitDetails[];
  files: PullRequestFile[];
}

interface PullRequestDetails {
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

class GitHubPRIntegration {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';

  private targetBranch = 'Codex';  // Target branch to analyze
  private baseBranch = 'main';     // Base branch to compare against

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
        'User-Agent': 'Stage-Senior-PR-Integration-Tool'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async fetchBranchComparison(): Promise<BranchComparison> {
    console.log(`🔍 Comparing ${this.targetBranch} branch with ${this.baseBranch}...`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/compare/${this.baseBranch}...${this.targetBranch}`);
  }

  async fetchCommitDetails(sha: string): Promise<CommitDetails> {
    console.log(`📋 Fetching commit details for ${sha.substring(0, 8)}...`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/commits/${sha}`);
  }

  async fetchFileContent(url: string): Promise<string> {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Stage-Senior-PR-Integration-Tool'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
    }

    return response.text();
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

  async analyzeBranch(): Promise<void> {
    console.log('🚀 Starting Codex Branch Integration Analysis');
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🎯 Target Branch: ${this.targetBranch}`);
    console.log(`🎯 Base Branch: ${this.baseBranch}\n`);

    try {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔄 ANALYZING CODEX BRANCH`);
      console.log(`${'='.repeat(60)}`);

      const comparison = await this.fetchBranchComparison();

      console.log(`📊 Branch Comparison Status: ${comparison.status}`);
      console.log(`📈 Commits ahead: ${comparison.ahead_by}`);
      console.log(`📉 Commits behind: ${comparison.behind_by}`);
      console.log(`📋 Total commits: ${comparison.total_commits}`);
      console.log(`📁 Files changed: ${comparison.files.length}`);

      console.log(`\n📋 COMMITS IN CODEX BRANCH:`);
      console.log('-'.repeat(50));
      
      for (const commit of comparison.commits) {
        console.log(`\n📝 ${commit.sha.substring(0, 8)} - ${commit.commit.message}`);
        console.log(`   👤 Author: ${commit.commit.author.name} <${commit.commit.author.email}>`);
        console.log(`   📅 Date: ${this.formatDate(commit.commit.author.date)}`);
        if (commit.author) {
          console.log(`   🐙 GitHub: ${commit.author.login}`);
        }
      }

      console.log(`\n📁 FILES CHANGED (${comparison.files.length}):`);
      console.log('-'.repeat(50));

      // Group files by status
      const filesByStatus = comparison.files.reduce((acc, file) => {
        if (!acc[file.status]) acc[file.status] = [];
        acc[file.status].push(file);
        return acc;
      }, {} as Record<string, PullRequestFile[]>);

      for (const [status, files] of Object.entries(filesByStatus)) {
        console.log(`\n🔧 ${status.toUpperCase()} FILES (${files.length}):`);
        
        for (const file of files) {
          console.log(`\n  📄 ${file.filename}`);
          console.log(`     📈 Changes: +${file.additions}/-${file.deletions}`);
          
          if (file.previous_filename) {
            console.log(`     🔄 Previous name: ${file.previous_filename}`);
          }

          if (file.patch && status !== 'added') {
            console.log(`     🔧 Patch preview:`);
            const patchLines = file.patch.split('\n').slice(0, 8);
            patchLines.forEach(line => {
              if (line.startsWith('@@')) {
                console.log(`        📍 ${line}`);
              } else if (line.startsWith('+')) {
                console.log(`        ✅ ${line}`);
              } else if (line.startsWith('-')) {
                console.log(`        ❌ ${line}`);
              } else {
                console.log(`           ${line}`);
              }
            });
            if (file.patch.split('\n').length > 8) {
              console.log(`        ... ${file.patch.split('\n').length - 8} more lines`);
            }
          }
        }
      }

      console.log(`\n\n${'='.repeat(80)}`);
      console.log('📊 CODEX BRANCH INTEGRATION SUMMARY');
      console.log(`${'='.repeat(80)}`);

      const totalAdditions = comparison.files.reduce((sum, file) => sum + file.additions, 0);
      const totalDeletions = comparison.files.reduce((sum, file) => sum + file.deletions, 0);

      console.log(`\n🔄 Codex Branch Analysis:`);
      console.log(`   📋 Total commits: ${comparison.total_commits}`);
      console.log(`   📁 Files to modify: ${comparison.files.length}`);
      console.log(`   📊 Total changes: +${totalAdditions}/-${totalDeletions}`);
      console.log(`   🎯 Integration status: Ready for analysis`);
      
      // Integration recommendations
      console.log(`\n💡 INTEGRATION RECOMMENDATIONS:`);
      console.log(`   1. Review ${comparison.commits.length} commits for conflicts`);
      console.log(`   2. Test ${filesByStatus.modified?.length || 0} modified files`);
      console.log(`   3. Verify ${filesByStatus.added?.length || 0} new files`);
      if (filesByStatus.removed?.length) {
        console.log(`   4. Confirm ${filesByStatus.removed.length} file deletions`);
      }

      console.log(`\n✅ Codex branch analysis complete!`);
      return;

    } catch (error) {
      console.error(`❌ Error analyzing Codex branch:`, error);
      throw error;
    }
  }

  async generateIntegrationPlan(): Promise<boolean> {
    console.log(`\n🔧 Generating integration plan for Codex branch...`);
    
    try {
      const comparison = await this.fetchBranchComparison();

      console.log(`📋 Analyzing branch: ${this.targetBranch}`);
      console.log(`📁 Files to process: ${comparison.files.length}`);
      console.log(`📋 Commits to integrate: ${comparison.commits.length}`);

      // Store integration data for return to main process
      const integrationData = {
        branch: this.targetBranch,
        baseBranch: this.baseBranch,
        aheadBy: comparison.ahead_by,
        behindBy: comparison.behind_by,
        totalCommits: comparison.total_commits,
        commits: comparison.commits.map(commit => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: commit.commit.author.name,
          email: commit.commit.author.email,
          date: commit.commit.author.date,
          githubUser: commit.author?.login
        })),
        files: comparison.files.map(file => ({
          filename: file.filename,
          status: file.status,
          patch: file.patch,
          additions: file.additions,
          deletions: file.deletions,
          previous_filename: file.previous_filename
        })),
        summary: {
          totalAdditions: comparison.files.reduce((sum, file) => sum + file.additions, 0),
          totalDeletions: comparison.files.reduce((sum, file) => sum + file.deletions, 0),
          filesByStatus: comparison.files.reduce((acc, file) => {
            if (!acc[file.status]) acc[file.status] = 0;
            acc[file.status]++;
            return acc;
          }, {} as Record<string, number>)
        }
      };

      // Output integration data as JSON for processing by the main script
      console.log('\n📋 INTEGRATION_DATA_START');
      console.log(JSON.stringify(integrationData, null, 2));
      console.log('📋 INTEGRATION_DATA_END');

      return true;
    } catch (error) {
      console.error(`❌ Error generating integration plan:`, error);
      return false;
    }
  }

  async runCodexIntegration(): Promise<void> {
    console.log('🚀 Starting Codex branch integration analysis...\n');
    
    console.log('Step 1: Analyzing branch differences...');
    await this.analyzeBranch();
    
    console.log('\n\nStep 2: Generating integration plan...');
    const success = await this.generateIntegrationPlan();

    console.log('\n📊 CODEX INTEGRATION RESULTS:');
    console.log(`   Analysis: ✅ Complete`);
    console.log(`   Integration Plan: ${success ? '✅ Generated' : '❌ Failed'}`);
    
    if (success) {
      console.log('\n🎆 Codex branch is ready for integration!');
      console.log('Next steps:');
      console.log('1. Review the integration plan above');
      console.log('2. Create a merge strategy');
      console.log('3. Test changes in a development environment');
      console.log('4. Execute integration with proper backup');
    }
  }
}

// Main execution
async function runGitHubPRIntegration() {
  const args = process.argv.slice(2);
  const integration = new GitHubPRIntegration();

  if (args.includes('--analyze')) {
    await integration.analyzeBranch();
  } else if (args.includes('--integrate')) {
    await integration.runCodexIntegration();
  } else if (args.includes('--plan')) {
    await integration.generateIntegrationPlan();
  } else {
    console.log('🎯 Codex Branch Integration Tool');
    console.log('Usage:');
    console.log('  tsx scripts/github-pr-integration.ts --analyze     # Analyze Codex branch');
    console.log('  tsx scripts/github-pr-integration.ts --integrate   # Full integration analysis');
    console.log('  tsx scripts/github-pr-integration.ts --plan        # Generate integration plan only');
    console.log('');
    console.log('Environment Variables:');
    console.log('  GITHUB_TOKEN  - GitHub Personal Access Token (required)');
  }
}

runGitHubPRIntegration().catch(console.error);