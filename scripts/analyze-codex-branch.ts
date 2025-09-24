#!/usr/bin/env tsx

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
  files?: {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
  }[];
}

interface CompareData {
  ahead_by: number;
  behind_by: number;
  commits: CommitInfo[];
  files: {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
    changes: number;
    patch?: string;
  }[];
}

class CodexBranchAnalyzer {
  private token: string;
  private owner: string = 'stagesen';
  private repo: string = 'stage-senior-platform';
  private baseURL: string = 'https://api.github.com';
  private codexBranch: string = 'Codex';
  private mainBranch: string = 'main';

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
        'User-Agent': 'Stage-Senior-Codex-Analyzer'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCodexBranchComparison(): Promise<CompareData> {
    console.log(`🔍 Comparing ${this.mainBranch}...${this.codexBranch}`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/compare/${this.mainBranch}...${this.codexBranch}`);
  }

  async getCommitDetails(sha: string): Promise<CommitInfo> {
    console.log(`📝 Fetching detailed information for commit ${sha.substring(0, 8)}`);
    return await this.makeRequest(`/repos/${this.owner}/${this.repo}/commits/${sha}`);
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

  categorizeCommit(message: string): string[] {
    const categories: string[] = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
      categories.push('🐛 Bug Fix');
    }
    if (lowerMessage.includes('feat') || lowerMessage.includes('feature')) {
      categories.push('✨ Feature');
    }
    if (lowerMessage.includes('profile')) {
      categories.push('👤 Profile');
    }
    if (lowerMessage.includes('avatar')) {
      categories.push('🖼️ Avatar');
    }
    if (lowerMessage.includes('about') || lowerMessage.includes('about-us')) {
      categories.push('📄 About Us');
    }
    if (lowerMessage.includes('style') || lowerMessage.includes('css') || lowerMessage.includes('ui')) {
      categories.push('💄 UI/Style');
    }
    if (lowerMessage.includes('refactor') || lowerMessage.includes('cleanup')) {
      categories.push('♻️ Refactor');
    }

    return categories.length > 0 ? categories : ['🔄 Other'];
  }

  analyzeFilePath(filename: string): { 
    component: string; 
    type: 'frontend' | 'backend' | 'config' | 'docs';
    relevance: 'high' | 'medium' | 'low';
  } {
    const isConfig = filename.includes('config') || filename.includes('.json') || filename.includes('.ts') && !filename.includes('src/');
    const isBackend = filename.includes('server/') || filename.includes('shared/');
    const isFrontend = filename.includes('client/') || filename.includes('src/');
    const isDocs = filename.includes('.md') || filename.includes('README');

    let component = 'Unknown';
    let relevance: 'high' | 'medium' | 'low' = 'low';

    if (filename.includes('profile') || filename.includes('Profile')) {
      component = 'Profile System';
      relevance = 'high';
    } else if (filename.includes('avatar') || filename.includes('Avatar')) {
      component = 'Avatar Component';
      relevance = 'high';
    } else if (filename.includes('about') || filename.includes('About')) {
      component = 'About Us Page';
      relevance = 'medium';
    } else if (filename.includes('components')) {
      component = 'UI Components';
      relevance = 'medium';
    } else if (filename.includes('pages')) {
      component = 'Page Components';
      relevance = 'medium';
    } else if (filename.includes('schema') || filename.includes('storage')) {
      component = 'Data Layer';
      relevance = 'high';
    } else if (filename.includes('routes')) {
      component = 'API Routes';
      relevance = 'high';
    }

    const type = isDocs ? 'docs' : isConfig ? 'config' : isBackend ? 'backend' : isFrontend ? 'frontend' : 'config';

    return { component, type, relevance };
  }

  async analyzeCodexBranch(): Promise<void> {
    console.log('🚀 Starting Codex Branch Analysis for Stage Senior Platform');
    console.log(`🌿 Branch: ${this.codexBranch}`);
    console.log(`🎯 Target: ${this.mainBranch}\n`);

    try {
      // Get comparison data
      const compareData = await this.getCodexBranchComparison();

      console.log('=' .repeat(80));
      console.log('📊 CODEX BRANCH ANALYSIS REPORT');
      console.log('=' .repeat(80));
      console.log(`🗓️ Generated: ${new Date().toLocaleString()}`);
      console.log(`📈 Commits ahead of ${this.mainBranch}: ${compareData.ahead_by}`);
      console.log(`📉 Commits behind ${this.mainBranch}: ${compareData.behind_by}`);
      console.log(`📝 Total files changed: ${compareData.files.length}\n`);

      if (compareData.ahead_by === 0) {
        console.log('✅ Codex branch is up to date with main! No changes to integrate.');
        return;
      }

      // Analyze each commit
      console.log('📝 COMMIT ANALYSIS');
      console.log('-' .repeat(50));

      const detailedCommits: CommitInfo[] = [];
      for (const commit of compareData.commits.reverse()) { // Show chronologically
        const detailedCommit = await this.getCommitDetails(commit.sha);
        detailedCommits.push(detailedCommit);

        const categories = this.categorizeCommit(commit.commit.message);
        const messageLines = commit.commit.message.split('\n');
        const shortMessage = messageLines[0];
        const description = messageLines.slice(1).join('\n').trim();

        console.log(`\n🔸 ${shortMessage}`);
        console.log(`   🔗 SHA: ${commit.sha.substring(0, 8)}`);
        console.log(`   👤 Author: ${commit.commit.author.name} (${commit.author?.login || 'Unknown'})`);
        console.log(`   📅 Date: ${this.formatDate(commit.commit.author.date)}`);
        console.log(`   🏷️  Categories: ${categories.join(', ')}`);
        
        if (description) {
          console.log(`   📋 Description: ${description.substring(0, 150) + (description.length > 150 ? '...' : '')}`);
        }

        if (detailedCommit.files) {
          console.log(`   📁 Files changed: ${detailedCommit.files.length}`);
          const highRelevanceFiles = detailedCommit.files
            .map(file => ({ ...file, analysis: this.analyzeFilePath(file.filename) }))
            .filter(file => file.analysis.relevance === 'high');
          
          if (highRelevanceFiles.length > 0) {
            console.log(`   🎯 High relevance files:`);
            highRelevanceFiles.forEach(file => {
              console.log(`      - ${file.filename} (${file.analysis.component})`);
            });
          }
        }
      }

      // File change analysis
      console.log('\n\n📁 FILE CHANGE ANALYSIS');
      console.log('-' .repeat(50));

      const filesByComponent = new Map<string, { files: any[], types: Set<string> }>();
      const filesByRelevance = { high: [], medium: [], low: [] } as any;

      compareData.files.forEach(file => {
        const analysis = this.analyzeFilePath(file.filename);
        const fileWithAnalysis = { ...file, analysis };

        // Group by component
        if (!filesByComponent.has(analysis.component)) {
          filesByComponent.set(analysis.component, { files: [], types: new Set() });
        }
        filesByComponent.get(analysis.component)!.files.push(fileWithAnalysis);
        filesByComponent.get(analysis.component)!.types.add(analysis.type);

        // Group by relevance
        filesByRelevance[analysis.relevance].push(fileWithAnalysis);
      });

      console.log('\n🎯 HIGH PRIORITY CHANGES (Files to review first):');
      if (filesByRelevance.high.length === 0) {
        console.log('   ✅ No high priority files found');
      } else {
        filesByRelevance.high.forEach((file: any) => {
          console.log(`   🔸 ${file.filename} (${file.status})`);
          console.log(`      Component: ${file.analysis.component} | Type: ${file.analysis.type}`);
          console.log(`      Changes: +${file.additions} -${file.deletions}`);
        });
      }

      console.log('\n📊 CHANGES BY COMPONENT:');
      Array.from(filesByComponent.entries())
        .sort(([,a], [,b]) => b.files.length - a.files.length)
        .forEach(([component, data]) => {
          console.log(`\n   🔹 ${component}: ${data.files.length} files`);
          console.log(`      Types: ${Array.from(data.types).join(', ')}`);
          
          const totalChanges = data.files.reduce((sum: number, file: any) => sum + file.changes, 0);
          const totalAdditions = data.files.reduce((sum: number, file: any) => sum + file.additions, 0);
          const totalDeletions = data.files.reduce((sum: number, file: any) => sum + file.deletions, 0);
          
          console.log(`      Changes: +${totalAdditions} -${totalDeletions} (${totalChanges} total)`);
          
          // Show first few files
          data.files.slice(0, 3).forEach((file: any) => {
            console.log(`         - ${file.filename} (${file.status})`);
          });
          if (data.files.length > 3) {
            console.log(`         ... and ${data.files.length - 3} more files`);
          }
        });

      // Integration recommendations
      console.log('\n\n🎯 INTEGRATION RECOMMENDATIONS');
      console.log('-' .repeat(50));

      console.log('\n📋 PRIORITY ORDER FOR INTEGRATION:');

      // 1. Profile fixes (mentioned in task description)
      const profileRelatedChanges = detailedCommits.filter(commit => 
        commit.commit.message.toLowerCase().includes('profile') ||
        (commit.files && commit.files.some(file => file.filename.toLowerCase().includes('profile')))
      );

      if (profileRelatedChanges.length > 0) {
        console.log('\n🏆 1. PROFILE-RELATED FIXES (HIGHEST PRIORITY)');
        profileRelatedChanges.forEach(commit => {
          console.log(`   🔸 ${commit.commit.message.split('\n')[0]}`);
          console.log(`      SHA: ${commit.sha.substring(0, 8)} | Author: ${commit.commit.author.name}`);
        });
      }

      // 2. Bug fixes
      const bugFixes = detailedCommits.filter(commit => 
        commit.commit.message.toLowerCase().includes('fix') ||
        commit.commit.message.toLowerCase().includes('bug')
      );

      if (bugFixes.length > 0) {
        console.log('\n🐛 2. BUG FIXES');
        bugFixes.forEach(commit => {
          console.log(`   🔸 ${commit.commit.message.split('\n')[0]}`);
          console.log(`      SHA: ${commit.sha.substring(0, 8)} | Author: ${commit.commit.author.name}`);
        });
      }

      // 3. Feature enhancements
      const features = detailedCommits.filter(commit => 
        commit.commit.message.toLowerCase().includes('feat') ||
        commit.commit.message.toLowerCase().includes('feature') ||
        commit.commit.message.toLowerCase().includes('add')
      );

      if (features.length > 0) {
        console.log('\n✨ 3. FEATURE ENHANCEMENTS');
        features.forEach(commit => {
          console.log(`   🔸 ${commit.commit.message.split('\n')[0]}`);
          console.log(`      SHA: ${commit.sha.substring(0, 8)} | Author: ${commit.commit.author.name}`);
        });
      }

      console.log('\n⚠️ INTEGRATION STRATEGY:');
      console.log('1. 🔍 Check if About Us/Avatar changes are already integrated in current codebase');
      console.log('2. 🎯 Focus on profile-related bug fixes (as mentioned in task description)');
      console.log('3. 📋 Apply high-priority file changes first');
      console.log('4. 🧪 Test each integration before proceeding to next');
      console.log('5. ⚡ Skip any changes that conflict with or duplicate current codebase');

      console.log('\n📋 NEXT STEPS:');
      console.log('1. Export this analysis data for integration script');
      console.log('2. Compare high-priority files with current codebase');
      console.log('3. Create selective integration plan');
      console.log('4. Apply changes incrementally with testing');

      console.log('\n' + '=' .repeat(80));
      console.log('✅ Codex Branch Analysis Complete!');
      console.log('=' .repeat(80));

      // Export data for next steps
      return {
        compareData,
        detailedCommits,
        filesByComponent: Object.fromEntries(filesByComponent),
        filesByRelevance,
        summary: {
          totalCommits: compareData.ahead_by,
          totalFiles: compareData.files.length,
          profileFixes: profileRelatedChanges.length,
          bugFixes: bugFixes.length,
          features: features.length
        }
      } as any;

    } catch (error) {
      console.error('❌ Error during Codex branch analysis:', error);
      throw error;
    }
  }
}

// Run the analysis
async function main() {
  const analyzer = new CodexBranchAnalyzer();
  await analyzer.analyzeCodexBranch();
}

main().catch(console.error);