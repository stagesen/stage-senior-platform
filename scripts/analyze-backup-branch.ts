#!/usr/bin/env tsx

class BackupBranchAnalyzer {
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

  async analyzeBackupBranch() {
    console.log('🔍 Analyzing backup/recent-work-before-rollback branch changes...\n');
    
    try {
      // Get compare information between main and backup branch
      const compareData = await this.makeRequest(
        `/repos/${this.owner}/${this.repo}/compare/main...backup/recent-work-before-rollback`
      );

      console.log('📊 BACKUP BRANCH ANALYSIS');
      console.log('=' .repeat(50));
      console.log(`📈 Commits ahead of main: ${compareData.ahead_by}`);
      console.log(`📉 Commits behind main: ${compareData.behind_by}`);
      console.log(`📝 Files changed: ${compareData.files?.length || 0}`);
      console.log(`➕ Total additions: ${compareData.ahead_by > 0 ? compareData.files?.reduce((sum: number, file: any) => sum + file.additions, 0) : 0}`);
      console.log(`➖ Total deletions: ${compareData.ahead_by > 0 ? compareData.files?.reduce((sum: number, file: any) => sum + file.deletions, 0) : 0}\n`);

      if (compareData.commits && compareData.commits.length > 0) {
        console.log('📋 COMMITS IN BACKUP BRANCH:');
        console.log('-' .repeat(40));
        compareData.commits.forEach((commit: any) => {
          console.log(`🔸 ${commit.sha.substring(0, 8)} - ${commit.commit.message}`);
          console.log(`   👤 ${commit.commit.author.name} - ${new Date(commit.commit.author.date).toLocaleString()}`);
        });
        console.log('');
      }

      if (compareData.files && compareData.files.length > 0) {
        console.log('📁 CHANGED FILES:');
        console.log('-' .repeat(40));
        compareData.files.forEach((file: any) => {
          console.log(`📄 ${file.filename}`);
          console.log(`   📊 Status: ${file.status}`);
          console.log(`   ➕ +${file.additions} ➖ -${file.deletions}`);
          if (file.patch) {
            console.log(`   🔧 Changes preview:`);
            const lines = file.patch.split('\n').slice(0, 10);
            lines.forEach((line: string) => {
              if (line.startsWith('+')) {
                console.log(`   ${line}`);
              } else if (line.startsWith('-')) {
                console.log(`   ${line}`);
              }
            });
            if (file.patch.split('\n').length > 10) {
              console.log(`   ... (truncated, ${file.patch.split('\n').length - 10} more lines)`);
            }
          }
          console.log('');
        });
      }

      // Return the data for further processing
      return compareData;

    } catch (error) {
      console.error('❌ Error analyzing backup branch:', error);
      throw error;
    }
  }
}

async function main() {
  const analyzer = new BackupBranchAnalyzer();
  const result = await analyzer.analyzeBackupBranch();
  
  // Save the comparison data to a JSON file for further analysis
  const fs = await import('fs');
  fs.writeFileSync('backup-branch-analysis.json', JSON.stringify(result, null, 2));
  console.log('💾 Analysis saved to backup-branch-analysis.json');
}

main().catch(console.error);
