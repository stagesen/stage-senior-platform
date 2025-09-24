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

  private targetPRs = [12, 13, 15, 16, 17];

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

  async fetchPRDetails(prNumber: number): Promise<PullRequestDetails> {
    console.log(`🔍 Fetching PR #${prNumber} details...`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}`);
  }

  async fetchPRFiles(prNumber: number): Promise<PullRequestFile[]> {
    console.log(`📁 Fetching files changed in PR #${prNumber}...`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/pulls/${prNumber}/files`);
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

  async analyzeAllPRs(): Promise<void> {
    console.log('🚀 Starting GitHub PR Integration Analysis');
    console.log(`📂 Repository: ${this.owner}/${this.repo}`);
    console.log(`🎯 Target PRs: ${this.targetPRs.join(', ')}\n`);

    const prAnalysis: {
      number: number;
      details: PullRequestDetails;
      files: PullRequestFile[];
    }[] = [];

    for (const prNumber of this.targetPRs) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔄 ANALYZING PR #${prNumber}`);
        console.log(`${'='.repeat(60)}`);

        const [prDetails, prFiles] = await Promise.all([
          this.fetchPRDetails(prNumber),
          this.fetchPRFiles(prNumber)
        ]);

        console.log(`📋 Title: ${prDetails.title}`);
        console.log(`👤 Author: ${prDetails.user.login}`);
        console.log(`📅 Created: ${this.formatDate(prDetails.created_at)}`);
        console.log(`📅 Updated: ${this.formatDate(prDetails.updated_at)}`);
        console.log(`🚦 State: ${prDetails.state}`);
        console.log(`✅ Mergeable: ${prDetails.mergeable === null ? 'Unknown' : prDetails.mergeable ? 'Yes' : 'No'}`);
        console.log(`📊 Changes: +${prDetails.additions}/-${prDetails.deletions} across ${prDetails.changed_files} files`);
        
        if (prDetails.body && prDetails.body.trim()) {
          console.log(`📝 Description: ${prDetails.body.substring(0, 150)}${prDetails.body.length > 150 ? '...' : ''}`);
        }

        console.log(`\n📁 FILES CHANGED (${prFiles.length}):`);
        console.log('-'.repeat(40));

        for (const file of prFiles) {
          console.log(`\n📄 ${file.filename}`);
          console.log(`   📊 Status: ${file.status}`);
          console.log(`   📈 Changes: +${file.additions}/-${file.deletions}`);
          
          if (file.previous_filename) {
            console.log(`   🔄 Previous name: ${file.previous_filename}`);
          }

          if (file.patch) {
            console.log(`   🔧 Patch preview:`);
            const patchLines = file.patch.split('\n').slice(0, 10);
            patchLines.forEach(line => {
              if (line.startsWith('@@')) {
                console.log(`      📍 ${line}`);
              } else if (line.startsWith('+')) {
                console.log(`      ✅ ${line}`);
              } else if (line.startsWith('-')) {
                console.log(`      ❌ ${line}`);
              } else {
                console.log(`         ${line}`);
              }
            });
            if (file.patch.split('\n').length > 10) {
              console.log(`      ... ${file.patch.split('\n').length - 10} more lines`);
            }
          }
        }

        prAnalysis.push({
          number: prNumber,
          details: prDetails,
          files: prFiles
        });

      } catch (error) {
        console.error(`❌ Error analyzing PR #${prNumber}:`, error);
      }
    }

    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 INTEGRATION SUMMARY');
    console.log(`${'='.repeat(80)}`);

    for (const analysis of prAnalysis) {
      console.log(`\n🔄 PR #${analysis.number}: ${analysis.details.title}`);
      console.log(`   📁 Files to modify: ${analysis.files.length}`);
      console.log(`   📊 Total changes: +${analysis.details.additions}/-${analysis.details.deletions}`);
      console.log(`   🎯 Integration status: Ready for application`);
    }

    console.log(`\n✅ Analysis complete! All ${prAnalysis.length} PRs analyzed.`);
    return;
  }

  async integratePR(prNumber: number): Promise<boolean> {
    console.log(`\n🔧 Starting integration of PR #${prNumber}...`);
    
    try {
      const [prDetails, prFiles] = await Promise.all([
        this.fetchPRDetails(prNumber),
        this.fetchPRFiles(prNumber)
      ]);

      console.log(`📋 Integrating: ${prDetails.title}`);
      console.log(`📁 Files to process: ${prFiles.length}`);

      // Store integration data for return to main process
      const integrationData = {
        prNumber,
        title: prDetails.title,
        files: prFiles.map(file => ({
          filename: file.filename,
          status: file.status,
          patch: file.patch,
          additions: file.additions,
          deletions: file.deletions,
          previous_filename: file.previous_filename
        }))
      };

      // Output integration data as JSON for processing by the main script
      console.log('\n📋 INTEGRATION_DATA_START');
      console.log(JSON.stringify(integrationData, null, 2));
      console.log('📋 INTEGRATION_DATA_END');

      return true;
    } catch (error) {
      console.error(`❌ Error integrating PR #${prNumber}:`, error);
      return false;
    }
  }

  async integrateAllPRs(): Promise<void> {
    console.log('🚀 Starting integration of all target PRs...\n');
    
    const results: {
      prNumber: number;
      success: boolean;
    }[] = [];
    for (const prNumber of this.targetPRs) {
      const success = await this.integratePR(prNumber);
      results.push({ prNumber, success });
    }

    console.log('\n📊 INTEGRATION RESULTS:');
    results.forEach(({ prNumber, success }) => {
      console.log(`   PR #${prNumber}: ${success ? '✅ Success' : '❌ Failed'}`);
    });
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const integration = new GitHubPRIntegration();

  if (args.includes('--analyze')) {
    await integration.analyzeAllPRs();
  } else if (args.includes('--integrate')) {
    await integration.integrateAllPRs();
  } else {
    console.log('🎯 GitHub PR Integration Tool');
    console.log('Usage:');
    console.log('  npm run github-pr -- --analyze    # Analyze PRs');
    console.log('  npm run github-pr -- --integrate  # Integrate PRs');
  }
}

main().catch(console.error);