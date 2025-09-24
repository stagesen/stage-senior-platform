#!/usr/bin/env tsx

interface CommitFile {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

interface TargetCommit {
  sha: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  shouldApply: boolean;
  reason: string;
}

class SelectiveCodexIntegrator {
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
        'User-Agent': 'Stage-Senior-Selective-Integrator'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFileContentFromBranch(filepath: string, branch: string = 'Codex'): Promise<string | null> {
    try {
      const response = await this.makeRequest(`/repos/${this.owner}/${this.repo}/contents/${filepath}?ref=${branch}`);
      if (response.content) {
        return Buffer.from(response.content, 'base64').toString('utf8');
      }
    } catch (error) {
      console.warn(`Could not fetch ${filepath} from ${branch}:`, error);
    }
    return null;
  }

  async getCommitFiles(sha: string): Promise<CommitFile[]> {
    const commit = await this.makeRequest(`/repos/${this.owner}/${this.repo}/commits/${sha}`);
    return commit.files || [];
  }

  private getIntegrationTargets(): TargetCommit[] {
    // Based on our analysis, these are the commits we want to consider
    return [
      {
        sha: '84cb5d78',
        message: 'Fix error when attempting to view profile information',
        priority: 'high',
        shouldApply: true,
        reason: 'Critical profile bug fix - exactly what was requested in task description'
      },
      {
        sha: '342828d2',
        message: 'Add filtering and selection for community events to the platform',
        priority: 'medium',
        shouldApply: true,
        reason: 'Valuable community enhancement - events filtering not currently in codebase'
      },
      {
        sha: 'b6175768',
        message: 'Add a features highlights section to showcase community benefits',
        priority: 'medium',
        shouldApply: true,
        reason: 'Community enhancement - features highlights not in current community detail page'
      },
      {
        sha: '832931f6',
        message: 'Add interactive maps to community detail pages for location information',
        priority: 'medium',
        shouldApply: true,
        reason: 'Valuable addition - interactive maps not currently implemented'
      },
      {
        sha: '608e1924',
        message: 'Add AI-generated images to showcase community neighborhoods',
        priority: 'low',
        shouldApply: false,
        reason: 'Skip - current community pages already have good imagery'
      },
      {
        sha: '99c7f332',
        message: 'Enhance website pages with updated content and refined design elements',
        priority: 'low',
        shouldApply: false,
        reason: 'Skip - About Us page already well-developed in current codebase'
      }
    ];
  }

  private shouldSkipFile(filename: string): boolean {
    const skipPatterns = [
      'client/src/pages/about-us.tsx', // Already well-implemented
      'client/src/components/ui/avatar.tsx', // Already well-implemented
      '.png', '.jpg', '.jpeg', '.webp', '.gif', // Skip image files
      'attached_assets/', // Skip attached assets
    ];

    return skipPatterns.some(pattern => filename.includes(pattern));
  }

  async analyzeAndPrepareIntegration(): Promise<void> {
    console.log('🚀 Starting Selective Codex Integration Analysis');
    console.log('=' .repeat(70));

    const targets = this.getIntegrationTargets();
    console.log(`📋 Analyzing ${targets.length} target commits for integration...\n`);

    const integrationPlan: Array<{
      commit: TargetCommit;
      files: Array<{ file: CommitFile; content?: string; action: 'apply' | 'skip' | 'review' }>;
    }> = [];

    for (const target of targets) {
      console.log(`🔍 Analyzing commit ${target.sha.substring(0, 8)}: ${target.message}`);
      console.log(`   Priority: ${target.priority.toUpperCase()} | Should Apply: ${target.shouldApply ? 'YES' : 'NO'}`);
      console.log(`   Reason: ${target.reason}`);

      if (!target.shouldApply) {
        console.log(`   ⏭️  Skipping this commit\n`);
        continue;
      }

      // Get files changed in this commit
      const files = await this.getCommitFiles(target.sha);
      console.log(`   📁 Files changed: ${files.length}`);

      const fileAnalysis: Array<{ file: CommitFile; content?: string; action: 'apply' | 'skip' | 'review' }> = [];

      for (const file of files) {
        if (this.shouldSkipFile(file.filename)) {
          console.log(`      ⏭️  SKIP: ${file.filename} (already implemented or not needed)`);
          fileAnalysis.push({ file, action: 'skip' });
          continue;
        }

        // Get file content from Codex branch
        const content = await this.getFileContentFromBranch(file.filename);
        
        if (content) {
          console.log(`      ✅ APPLY: ${file.filename} (+${file.additions} -${file.deletions})`);
          fileAnalysis.push({ file, content, action: 'apply' });
        } else {
          console.log(`      ⚠️  REVIEW: ${file.filename} (could not fetch content)`);
          fileAnalysis.push({ file, action: 'review' });
        }
      }

      integrationPlan.push({ commit: target, files: fileAnalysis });
      console.log('');
    }

    // Generate integration summary
    console.log('📊 INTEGRATION PLAN SUMMARY');
    console.log('-' .repeat(50));

    const toApply = integrationPlan.flatMap(p => p.files.filter(f => f.action === 'apply'));
    const toSkip = integrationPlan.flatMap(p => p.files.filter(f => f.action === 'skip'));
    const toReview = integrationPlan.flatMap(p => p.files.filter(f => f.action === 'review'));

    console.log(`✅ Files to Apply: ${toApply.length}`);
    console.log(`⏭️  Files to Skip: ${toSkip.length}`);
    console.log(`⚠️  Files to Review: ${toReview.length}`);

    if (toApply.length > 0) {
      console.log('\n🎯 FILES TO APPLY:');
      toApply.forEach((item, index) => {
        console.log(`${index + 1}. ${item.file.filename}`);
        console.log(`   Status: ${item.file.status} | Changes: +${item.file.additions} -${item.file.deletions}`);
      });
    }

    if (toReview.length > 0) {
      console.log('\n⚠️  FILES REQUIRING REVIEW:');
      toReview.forEach((item, index) => {
        console.log(`${index + 1}. ${item.file.filename} (status: ${item.file.status})`);
      });
    }

    console.log('\n💡 NEXT STEPS:');
    console.log('1. Review the files to apply above');
    console.log('2. Apply changes incrementally starting with high-priority profile fix');
    console.log('3. Test each change before proceeding to next');
    console.log('4. Skip any changes that conflict with current codebase');

    // Export detailed plan for manual integration
    console.log('\n📋 DETAILED INTEGRATION DATA:');
    console.log('=' .repeat(70));

    for (const plan of integrationPlan) {
      const filesToApply = plan.files.filter(f => f.action === 'apply');
      if (filesToApply.length === 0) continue;

      console.log(`\n🔸 COMMIT: ${plan.commit.message}`);
      console.log(`   SHA: ${plan.commit.sha}`);
      console.log(`   Priority: ${plan.commit.priority}`);

      for (const fileItem of filesToApply) {
        console.log(`\n   📄 FILE: ${fileItem.file.filename}`);
        console.log(`   Status: ${fileItem.file.status}`);
        console.log(`   Changes: +${fileItem.file.additions} -${fileItem.file.deletions}`);
        
        if (fileItem.content) {
          console.log(`   Content Preview (first 200 chars):`);
          console.log(`   ${fileItem.content.substring(0, 200).replace(/\n/g, '\\n')}...`);
        }
      }
    }

    return integrationPlan as any;
  }
}

// Run the selective integration analysis
async function main() {
  const integrator = new SelectiveCodexIntegrator();
  await integrator.analyzeAndPrepareIntegration();
}

main().catch(console.error);