#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { Transform } = require('stream');

// Iconv for handling UTF-16 LE encoding
const iconv = require('iconv-lite');

const filePath = '/home/runner/workspace/attached_assets/- Gardens on Quail+2025-10-28_1761665136191.csv';

class GoogleAdsAnalyzer {
  constructor() {
    this.campaigns = {};
    this.adGroups = {};
    this.ads = {};
    this.headers = [];
    this.headerMap = {};
    this.rowCount = 0;
  }

  // Parse the tab-delimited CSV with UTF-16 LE encoding
  async parseFile() {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);

      // Transform stream to handle UTF-16 LE decoding
      const decoder = new Transform({
        transform(chunk, encoding, callback) {
          try {
            const decoded = iconv.decode(chunk, 'UTF-16LE');
            callback(null, decoded);
          } catch (err) {
            callback(err);
          }
        }
      });

      const rl = readline.createInterface({
        input: stream.pipe(decoder),
        crlfDelay: Infinity
      });

      let lineNumber = 0;

      rl.on('line', (line) => {
        lineNumber++;

        // Skip empty lines
        if (!line.trim()) return;

        // Parse the tab-separated values
        const fields = line.split('\t');

        if (lineNumber === 1) {
          // Header row - remove BOM if present
          this.headers = fields.map(h => h.replace(/^\ufeff/, '').trim());
          this.headers.forEach((header, index) => {
            this.headerMap[header] = index;
          });
          console.log(`Found ${this.headers.length} columns`);
        } else {
          this.rowCount++;
          this.processRow(fields);
        }
      });

      rl.on('close', () => {
        resolve();
      });

      rl.on('error', reject);
    });
  }

  processRow(fields) {
    const data = {};
    this.headers.forEach((header, index) => {
      data[header] = (fields[index] || '').trim();
    });

    const campaign = data['Campaign'] || 'Unknown Campaign';
    const adGroup = data['Ad Group'] || 'Unknown Ad Group';
    const headline1 = data['Headline 1'] || '';
    const finalUrl = data['Final URL'] || '';
    const businessName = data['Business name'] || '';

    // Track campaigns
    if (campaign && campaign !== '') {
      if (!this.campaigns[campaign]) {
        this.campaigns[campaign] = {
          name: campaign,
          adGroups: new Set(),
          headlines: new Set(),
          urls: new Set(),
          count: 0
        };
      }
      this.campaigns[campaign].count++;
      this.campaigns[campaign].adGroups.add(adGroup);
      if (headline1) {
        this.campaigns[campaign].headlines.add(headline1);
      }
      if (finalUrl) {
        this.campaigns[campaign].urls.add(finalUrl);
      }
    }

    // Track ad groups
    if (adGroup && adGroup !== '') {
      if (!this.adGroups[adGroup]) {
        this.adGroups[adGroup] = {
          name: adGroup,
          campaign,
          ads: [],
          urls: new Set()
        };
      }
      if (finalUrl) {
        this.adGroups[adGroup].urls.add(finalUrl);
      }
    }

    // Track complete ad data
    const adKey = `${campaign}|${adGroup}|${headline1}`;
    if (!this.ads[adKey]) {
      this.ads[adKey] = {
        campaign,
        adGroup,
        businessName,
        finalUrl,
        headlines: [],
        longHeadlines: [],
        descriptions: [],
        paths: { path1: '', path2: '' },
        callToAction: data['Call to action'] || '',
        videoIds: []
      };

      // Collect all headlines
      for (let i = 1; i <= 15; i++) {
        const headline = data[`Headline ${i}`] || '';
        if (headline) {
          this.ads[adKey].headlines.push({ index: i, text: headline });
        }
      }

      // Collect long headlines
      for (let i = 1; i <= 5; i++) {
        const longHeadline = data[`Long headline ${i}`] || '';
        if (longHeadline) {
          this.ads[adKey].longHeadlines.push({ index: i, text: longHeadline });
        }
      }

      // Collect descriptions
      for (let i = 1; i <= 5; i++) {
        const description = data[`Description ${i}`] || '';
        if (description) {
          this.ads[adKey].descriptions.push({ index: i, text: description });
        }
      }

      // Paths
      this.ads[adKey].paths.path1 = data['Path 1'] || '';
      this.ads[adKey].paths.path2 = data['Path 2'] || '';

      // Video IDs
      for (let i = 1; i <= 5; i++) {
        const videoId = data[`Video ID ${i}`] || '';
        if (videoId) {
          this.ads[adKey].videoIds.push({ index: i, id: videoId });
        }
      }
    }
  }

  generateReport() {
    const report = [];

    report.push('=' .repeat(80));
    report.push('GOOGLE ADS ANALYSIS REPORT - Gardens on Quail Campaign');
    report.push('=' .repeat(80));
    report.push('');

    // Summary statistics
    report.push('SUMMARY STATISTICS');
    report.push('-'.repeat(80));
    report.push(`Total data rows processed: ${this.rowCount}`);
    report.push(`Total campaigns: ${Object.keys(this.campaigns).length}`);
    report.push(`Total ad groups: ${Object.keys(this.adGroups).length}`);
    report.push(`Total unique ads: ${Object.keys(this.ads).length}`);
    report.push('');

    // Campaign breakdown
    report.push('CAMPAIGN STRUCTURE');
    report.push('-'.repeat(80));

    Object.keys(this.campaigns).sort().forEach(campaignName => {
      const campaign = this.campaigns[campaignName];
      if (campaign.count > 0) {
        report.push('');
        report.push(`Campaign: "${campaignName}"`);
        report.push(`  Rows with this campaign: ${campaign.count}`);
        report.push(`  Ad Groups (${campaign.adGroups.size}): ${Array.from(campaign.adGroups).filter(ag => ag).join(', ')}`);
        report.push(`  Unique Headlines (${campaign.headlines.size}):`);
        Array.from(campaign.headlines)
          .filter(h => h)
          .slice(0, 10)
          .forEach(headline => {
            report.push(`    - "${headline}"`);
          });
        if (campaign.headlines.size > 10) {
          report.push(`    ... and ${campaign.headlines.size - 10} more`);
        }
        report.push(`  URLs (${campaign.urls.size}):`);
        Array.from(campaign.urls)
          .filter(url => url)
          .forEach(url => {
            report.push(`    - ${url}`);
          });
      }
    });

    report.push('');
    report.push('');

    // Ad groups with complete details
    report.push('AD GROUPS - DETAILED VIEW');
    report.push('-'.repeat(80));

    Object.keys(this.adGroups).sort().forEach(adGroupName => {
      const adGroup = this.adGroups[adGroupName];
      if (adGroupName && adGroupName !== 'Unknown Ad Group') {
        report.push('');
        report.push(`Ad Group: "${adGroupName}"`);
        report.push(`  Campaign: ${adGroup.campaign}`);
        report.push(`  URLs (${adGroup.urls.size}):`);
        Array.from(adGroup.urls)
          .filter(url => url)
          .forEach(url => {
            report.push(`    - ${url}`);
          });
      }
    });

    report.push('');
    report.push('');

    // Sample ads with full content
    report.push('COMPLETE AD EXAMPLES');
    report.push('-'.repeat(80));

    const adKeys = Object.keys(this.ads).filter(key => {
      const ad = this.ads[key];
      return ad.campaign && ad.campaign !== '' &&
             ad.adGroup && ad.adGroup !== '' &&
             (ad.headlines.length > 0 || ad.descriptions.length > 0);
    });

    let adCount = 0;
    adKeys.slice(0, 20).forEach(adKey => {
      const ad = this.ads[adKey];
      adCount++;

      report.push('');
      report.push(`Example Ad #${adCount}`);
      report.push(`  Campaign: ${ad.campaign}`);
      report.push(`  Ad Group: ${ad.adGroup}`);
      report.push(`  Business Name: ${ad.businessName || '(not set)'}`);
      report.push(`  Final URL: ${ad.finalUrl || '(not set)'}`);

      if (ad.paths.path1 || ad.paths.path2) {
        report.push(`  URL Paths:`);
        if (ad.paths.path1) report.push(`    Path 1: ${ad.paths.path1}`);
        if (ad.paths.path2) report.push(`    Path 2: ${ad.paths.path2}`);
      }

      if (ad.headlines.length > 0) {
        report.push(`  Headlines (${ad.headlines.length}):`);
        ad.headlines.forEach(h => {
          report.push(`    Headline ${h.index}: "${h.text}"`);
        });
      }

      if (ad.longHeadlines.length > 0) {
        report.push(`  Long Headlines (${ad.longHeadlines.length}):`);
        ad.longHeadlines.forEach(h => {
          report.push(`    Long Headline ${h.index}: "${h.text}"`);
        });
      }

      if (ad.descriptions.length > 0) {
        report.push(`  Descriptions (${ad.descriptions.length}):`);
        ad.descriptions.forEach(d => {
          report.push(`    Description ${d.index}: "${d.text}"`);
        });
      }

      if (ad.callToAction) {
        report.push(`  Call to Action: ${ad.callToAction}`);
      }

      if (ad.videoIds.length > 0) {
        report.push(`  Video IDs:`);
        ad.videoIds.forEach(v => {
          report.push(`    Video ${v.index}: ${v.id}`);
        });
      }
    });

    if (adKeys.length > 20) {
      report.push('');
      report.push(`... and ${adKeys.length - 20} more ads`);
    }

    report.push('');
    report.push('');

    // Pattern analysis
    report.push('CAMPAIGN PATTERNS & OBSERVATIONS');
    report.push('-'.repeat(80));

    const urlDomains = new Set();
    Object.keys(this.ads).forEach(adKey => {
      const url = this.ads[adKey].finalUrl;
      if (url) {
        try {
          const domain = new URL(url).hostname;
          urlDomains.add(domain);
        } catch (e) {
          // Invalid URL
        }
      }
    });

    report.push(`Unique domains being targeted: ${urlDomains.size}`);
    Array.from(urlDomains).forEach(domain => {
      report.push(`  - ${domain}`);
    });

    report.push('');

    // Check for common headline themes
    const headlineWords = {};
    Object.keys(this.ads).forEach(adKey => {
      const ad = this.ads[adKey];
      ad.headlines.forEach(h => {
        const words = h.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 4) {
            headlineWords[word] = (headlineWords[word] || 0) + 1;
          }
        });
      });
    });

    const topWords = Object.entries(headlineWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    report.push('Top keywords in headlines (words > 4 chars):');
    topWords.forEach(([word, count]) => {
      report.push(`  - "${word}": ${count} times`);
    });

    report.push('');
    report.push('=' .repeat(80));

    return report.join('\n');
  }
}

async function main() {
  console.log('Starting Google Ads CSV analysis...');
  console.log(`File: ${filePath}`);
  console.log('');

  const analyzer = new GoogleAdsAnalyzer();

  try {
    console.log('Parsing CSV file (this may take a moment for 5MB file)...');
    await analyzer.parseFile();
    console.log('✓ File parsed successfully');
    console.log('');

    const report = analyzer.generateReport();
    console.log(report);

    // Save report to file
    const reportPath = '/home/runner/workspace/google-ads-analysis.txt';
    fs.writeFileSync(reportPath, report);
    console.log(`\nReport saved to: ${reportPath}`);

    // Save JSON summary
    const jsonSummary = {
      timestamp: new Date().toISOString(),
      totalRows: analyzer.rowCount,
      campaigns: Object.keys(analyzer.campaigns).length,
      adGroups: Object.keys(analyzer.adGroups).length,
      uniqueAds: Object.keys(analyzer.ads).length,
      campaignsList: Object.keys(analyzer.campaigns).filter(c => c).sort(),
      adGroupsList: Object.keys(analyzer.adGroups).filter(ag => ag).sort()
    };

    const jsonPath = '/home/runner/workspace/google-ads-summary.json';
    fs.writeFileSync(jsonPath, JSON.stringify(jsonSummary, null, 2));
    console.log(`JSON summary saved to: ${jsonPath}`);

  } catch (error) {
    console.error('Error processing file:', error);
    process.exit(1);
  }
}

main();
