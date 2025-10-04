#!/usr/bin/env node
/**
 * SEO Performance Monitor for KPS Interiéry
 * Monitors SEO performance metrics and generates trend reports
 */

import fs from 'fs/promises';
import { performance } from 'perf_hooks';

class SEOPerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      historicalDataPath: './seo-history.json',
      alertThresholds: {
        scoreDecrease: 10, // Alert if score drops by 10+ points
        errorIncrease: 5,  // Alert if errors increase by 5+
        responseTime: 5000 // Alert if response time > 5 seconds
      },
      ...options
    };

    this.metrics = {
      timestamp: null,
      url: null,
      scores: {},
      responseTime: 0,
      errors: [],
      warnings: [],
      recommendations: [],
      trends: {}
    };
  }

  /**
   * Monitor SEO performance for a URL
   */
  async monitorURL(url, auditFunction) {
    console.log(`📊 Starting SEO performance monitoring for: ${url}`);
    const startTime = performance.now();

    try {
      // Run SEO audit
      const auditResult = await auditFunction(url);
      const endTime = performance.now();

      const currentMetrics = {
        timestamp: new Date().toISOString(),
        url,
        scores: this.extractScores(auditResult),
        responseTime: Math.round(endTime - startTime),
        errors: this.extractIssues(auditResult, 'error'),
        warnings: this.extractIssues(auditResult, 'warning'),
        recommendations: this.extractRecommendations(auditResult),
        pageInfo: {
          title: auditResult.meta?.title || 'Unknown',
          description: auditResult.meta?.metaTags?.description || 'No description',
          hasStructuredData: (auditResult.schema?.schemas?.length || 0) > 0,
          hasSocialTags: Object.keys(auditResult.social?.openGraph || {}).length > 0
        }
      };

      // Load historical data
      const historicalData = await this.loadHistoricalData();

      // Calculate trends
      currentMetrics.trends = this.calculateTrends(currentMetrics, historicalData);

      // Check for alerts
      const alerts = this.checkAlerts(currentMetrics, historicalData);

      // Save current metrics
      await this.saveMetrics(currentMetrics, historicalData);

      // Generate monitoring report
      const monitoringReport = this.generateMonitoringReport(currentMetrics, historicalData, alerts);

      console.log(`✅ Monitoring completed in ${currentMetrics.responseTime}ms`);

      return {
        current: currentMetrics,
        historical: historicalData,
        alerts,
        report: monitoringReport
      };

    } catch (error) {
      console.error(`❌ Monitoring failed: ${error.message}`);
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
        url
      };
    }
  }

  /**
   * Extract scores from audit result
   */
  extractScores(auditResult) {
    return {
      overall: auditResult.overall?.score || 0,
      meta: auditResult.meta?.score || 0,
      schema: auditResult.schema?.score || 0,
      social: auditResult.social?.score || 0,
      sitemap: auditResult.sitemap?.score || 0,
      performance: auditResult.performance?.score || 0,
      accessibility: auditResult.accessibility?.score || 0,
      security: auditResult.security?.score || 0
    };
  }

  /**
   * Extract issues of specific type
   */
  extractIssues(auditResult, type) {
    const issues = [];

    // Collect issues from all components
    ['meta', 'schema', 'social', 'performance', 'accessibility', 'security'].forEach(component => {
      const componentResult = auditResult[component];
      if (componentResult && componentResult.issues) {
        const componentIssues = componentResult.issues
          .filter(issue => issue.type === type)
          .map(issue => ({
            component,
            message: issue.message,
            severity: issue.severity,
            tag: issue.tag
          }));
        issues.push(...componentIssues);
      }
    });

    // Also check overall issues
    if (auditResult.overall && auditResult.overall.issues) {
      const overallIssues = auditResult.overall.issues
        .filter(issue => issue.type === type)
        .map(issue => ({
          component: issue.category || 'overall',
          message: issue.message,
          severity: issue.severity
        }));
      issues.push(...overallIssues);
    }

    return issues;
  }

  /**
   * Extract recommendations from audit result
   */
  extractRecommendations(auditResult) {
    const recommendations = [];

    if (auditResult.overall && auditResult.overall.recommendations) {
      recommendations.push(...auditResult.overall.recommendations.map(rec => ({
        message: typeof rec === 'string' ? rec : rec.message,
        priority: typeof rec === 'object' ? rec.priority : 'medium',
        category: typeof rec === 'object' ? rec.category : 'general'
      })));
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Calculate trends compared to historical data
   */
  calculateTrends(currentMetrics, historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return {
        isFirstRun: true,
        message: 'No historical data available for trend analysis'
      };
    }

    const lastMetrics = historicalData[historicalData.length - 1];
    const trends = {};

    // Score trends
    Object.keys(currentMetrics.scores).forEach(scoreType => {
      const currentScore = currentMetrics.scores[scoreType];
      const lastScore = lastMetrics.scores?.[scoreType] || 0;
      const change = currentScore - lastScore;

      trends[scoreType] = {
        current: currentScore,
        previous: lastScore,
        change,
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        percentage: lastScore > 0 ? Math.round((change / lastScore) * 100) : 0
      };
    });

    // Error/warning trends
    trends.errors = {
      current: currentMetrics.errors.length,
      previous: lastMetrics.errors?.length || 0,
      change: currentMetrics.errors.length - (lastMetrics.errors?.length || 0)
    };

    trends.warnings = {
      current: currentMetrics.warnings.length,
      previous: lastMetrics.warnings?.length || 0,
      change: currentMetrics.warnings.length - (lastMetrics.warnings?.length || 0)
    };

    // Response time trend
    trends.responseTime = {
      current: currentMetrics.responseTime,
      previous: lastMetrics.responseTime || 0,
      change: currentMetrics.responseTime - (lastMetrics.responseTime || 0)
    };

    // Calculate 7-day and 30-day averages if enough data
    if (historicalData.length >= 7) {
      const last7Days = historicalData.slice(-7);
      trends.averages = {
        last7Days: {
          overall: Math.round(last7Days.reduce((sum, m) => sum + (m.scores?.overall || 0), 0) / 7),
          responseTime: Math.round(last7Days.reduce((sum, m) => sum + (m.responseTime || 0), 0) / 7)
        }
      };

      if (historicalData.length >= 30) {
        const last30Days = historicalData.slice(-30);
        trends.averages.last30Days = {
          overall: Math.round(last30Days.reduce((sum, m) => sum + (m.scores?.overall || 0), 0) / 30),
          responseTime: Math.round(last30Days.reduce((sum, m) => sum + (m.responseTime || 0), 0) / 30)
        };
      }
    }

    return trends;
  }

  /**
   * Check for performance alerts
   */
  checkAlerts(currentMetrics, historicalData) {
    const alerts = [];

    if (!historicalData || historicalData.length === 0) {
      return alerts;
    }

    const lastMetrics = historicalData[historicalData.length - 1];
    const thresholds = this.options.alertThresholds;

    // Score decrease alert
    const overallScoreChange = currentMetrics.scores.overall - (lastMetrics.scores?.overall || 0);
    if (overallScoreChange <= -thresholds.scoreDecrease) {
      alerts.push({
        type: 'warning',
        category: 'score_decrease',
        message: `Overall SEO score decreased by ${Math.abs(overallScoreChange)} points`,
        currentValue: currentMetrics.scores.overall,
        previousValue: lastMetrics.scores?.overall || 0,
        severity: 'high'
      });
    }

    // Error increase alert
    const errorIncrease = currentMetrics.errors.length - (lastMetrics.errors?.length || 0);
    if (errorIncrease >= thresholds.errorIncrease) {
      alerts.push({
        type: 'error',
        category: 'error_increase',
        message: `SEO errors increased by ${errorIncrease}`,
        currentValue: currentMetrics.errors.length,
        previousValue: lastMetrics.errors?.length || 0,
        severity: 'high'
      });
    }

    // Response time alert
    if (currentMetrics.responseTime > thresholds.responseTime) {
      alerts.push({
        type: 'warning',
        category: 'slow_response',
        message: `SEO audit took ${currentMetrics.responseTime}ms (threshold: ${thresholds.responseTime}ms)`,
        currentValue: currentMetrics.responseTime,
        threshold: thresholds.responseTime,
        severity: 'medium'
      });
    }

    // Critical score thresholds
    if (currentMetrics.scores.overall < 50) {
      alerts.push({
        type: 'error',
        category: 'critical_score',
        message: 'Overall SEO score is critically low (< 50)',
        currentValue: currentMetrics.scores.overall,
        threshold: 50,
        severity: 'high'
      });
    }

    // Missing essential components
    if (currentMetrics.scores.meta < 70) {
      alerts.push({
        type: 'warning',
        category: 'meta_issues',
        message: 'Meta tags score is below recommended threshold',
        currentValue: currentMetrics.scores.meta,
        threshold: 70,
        severity: 'medium'
      });
    }

    if (currentMetrics.scores.schema < 60) {
      alerts.push({
        type: 'warning',
        category: 'schema_issues',
        message: 'Structured data score is below recommended threshold',
        currentValue: currentMetrics.scores.schema,
        threshold: 60,
        severity: 'medium'
      });
    }

    return alerts;
  }

  /**
   * Load historical monitoring data
   */
  async loadHistoricalData() {
    try {
      const data = await fs.readFile(this.options.historicalDataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, return empty array
      return [];
    }
  }

  /**
   * Save current metrics to historical data
   */
  async saveMetrics(currentMetrics, historicalData) {
    // Add current metrics to historical data
    historicalData.push(currentMetrics);

    // Keep only last 90 days of data (assuming daily monitoring)
    const maxEntries = 90;
    if (historicalData.length > maxEntries) {
      historicalData.splice(0, historicalData.length - maxEntries);
    }

    try {
      await fs.writeFile(this.options.historicalDataPath, JSON.stringify(historicalData, null, 2));
    } catch (error) {
      console.error(`Failed to save metrics: ${error.message}`);
    }
  }

  /**
   * Generate monitoring report
   */
  generateMonitoringReport(currentMetrics, historicalData, alerts) {
    const report = {
      summary: {
        timestamp: currentMetrics.timestamp,
        url: currentMetrics.url,
        overallScore: currentMetrics.scores.overall,
        totalErrors: currentMetrics.errors.length,
        totalWarnings: currentMetrics.warnings.length,
        responseTime: currentMetrics.responseTime,
        alertsCount: alerts.length
      },
      scoreBreakdown: currentMetrics.scores,
      trends: currentMetrics.trends,
      alerts,
      topIssues: [
        ...currentMetrics.errors.slice(0, 5).map(error => ({
          ...error,
          type: 'error'
        })),
        ...currentMetrics.warnings.slice(0, 3).map(warning => ({
          ...warning,
          type: 'warning'
        }))
      ],
      recommendations: currentMetrics.recommendations.slice(0, 5),
      historicalSummary: this.generateHistoricalSummary(historicalData)
    };

    return report;
  }

  /**
   * Generate historical data summary
   */
  generateHistoricalSummary(historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return {
        message: 'No historical data available',
        dataPoints: 0
      };
    }

    const scores = historicalData.map(d => d.scores?.overall || 0).filter(s => s > 0);

    return {
      dataPoints: historicalData.length,
      dateRange: {
        start: historicalData[0].timestamp,
        end: historicalData[historicalData.length - 1].timestamp
      },
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      minScore: scores.length > 0 ? Math.min(...scores) : 0,
      maxScore: scores.length > 0 ? Math.max(...scores) : 0,
      trend: this.calculateOverallTrend(scores)
    };
  }

  /**
   * Calculate overall trend direction
   */
  calculateOverallTrend(scores) {
    if (scores.length < 2) return 'insufficient_data';

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const difference = secondAvg - firstAvg;

    if (Math.abs(difference) < 2) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }

  /**
   * Generate performance chart data
   */
  generateChartData(historicalData, metric = 'overall') {
    if (!historicalData || historicalData.length === 0) {
      return { labels: [], data: [] };
    }

    const chartData = historicalData.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString(),
      value: entry.scores?.[metric] || 0,
      responseTime: entry.responseTime || 0,
      errors: entry.errors?.length || 0
    }));

    return {
      labels: chartData.map(d => d.date),
      scores: chartData.map(d => d.value),
      responseTimes: chartData.map(d => d.responseTime),
      errorCounts: chartData.map(d => d.errors)
    };
  }

  /**
   * Export monitoring data for external analysis
   */
  async exportData(format = 'json', outputPath) {
    const historicalData = await this.loadHistoricalData();

    if (format === 'csv') {
      const csvData = this.convertToCSV(historicalData);
      await fs.writeFile(outputPath, csvData);
    } else {
      await fs.writeFile(outputPath, JSON.stringify(historicalData, null, 2));
    }

    return outputPath;
  }

  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = [
      'timestamp', 'url', 'overall_score', 'meta_score', 'schema_score',
      'social_score', 'response_time', 'error_count', 'warning_count'
    ];

    const rows = data.map(entry => [
      entry.timestamp,
      entry.url,
      entry.scores?.overall || 0,
      entry.scores?.meta || 0,
      entry.scores?.schema || 0,
      entry.scores?.social || 0,
      entry.responseTime || 0,
      entry.errors?.length || 0,
      entry.warnings?.length || 0
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node performance-monitor.js <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  monitor <url>           Monitor SEO performance for URL');
    console.log('  export <format> <file>  Export historical data (json|csv)');
    console.log('  report [days]           Generate trend report');
    console.log('  alerts                  Show current alerts');
    console.log('');
    console.log('Examples:');
    console.log('  node performance-monitor.js monitor https://kps-interiery.cz');
    console.log('  node performance-monitor.js export csv seo-data.csv');
    console.log('  node performance-monitor.js report 30');
    process.exit(1);
  }

  const command = args[0];
  const monitor = new SEOPerformanceMonitor();

  switch (command) {
    case 'monitor': {
      if (args.length < 2) {
        console.error('❌ URL required for monitoring');
        process.exit(1);
      }

      const url = args[1];

      // Import SEO audit (would need to adjust import path)
      const { SEOAudit } = await import('./seo-audit.js');
      const audit = new SEOAudit();

      const result = await monitor.monitorURL(url, async (url) => {
        return await audit.auditURL(url);
      });

      if (result.error) {
        console.error(`❌ Monitoring failed: ${result.error}`);
        process.exit(1);
      }

      // Display results
      console.log('\n📊 SEO PERFORMANCE MONITORING REPORT');
      console.log('=====================================');
      console.log(`🌐 URL: ${result.current.url}`);
      console.log(`📅 Date: ${new Date(result.current.timestamp).toLocaleString()}`);
      console.log(`⚡ Response Time: ${result.current.responseTime}ms`);
      console.log(`🎯 Overall Score: ${result.current.scores.overall}/100`);

      if (result.alerts.length > 0) {
        console.log(`\n🚨 ALERTS (${result.alerts.length})`);
        result.alerts.forEach(alert => {
          const icon = alert.severity === 'high' ? '❌' : '⚠️';
          console.log(`${icon} ${alert.message}`);
        });
      }

      if (result.current.trends && !result.current.trends.isFirstRun) {
        console.log('\n📈 TRENDS');
        console.log(`Overall Score: ${result.current.trends.overall.direction} (${result.current.trends.overall.change > 0 ? '+' : ''}${result.current.trends.overall.change})`);
        console.log(`Errors: ${result.current.trends.errors.change > 0 ? '+' : ''}${result.current.trends.errors.change}`);
        console.log(`Warnings: ${result.current.trends.warnings.change > 0 ? '+' : ''}${result.current.trends.warnings.change}`);
      }

      break;
    }

    case 'export': {
      if (args.length < 3) {
        console.error('❌ Format and output file required');
        process.exit(1);
      }

      const format = args[1];
      const outputFile = args[2];

      await monitor.exportData(format, outputFile);
      console.log(`✅ Data exported to: ${outputFile}`);
      break;
    }

    case 'report': {
      const days = parseInt(args[1]) || 30;
      const historicalData = await monitor.loadHistoricalData();

      if (historicalData.length === 0) {
        console.log('❌ No historical data available');
        process.exit(1);
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentData = historicalData.filter(entry =>
        new Date(entry.timestamp) >= cutoffDate
      );

      console.log(`\n📊 SEO PERFORMANCE REPORT (Last ${days} days)`);
      console.log('='.repeat(50));
      console.log(`📈 Data Points: ${recentData.length}`);

      if (recentData.length > 0) {
        const scores = recentData.map(d => d.scores?.overall || 0);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);

        console.log(`🎯 Average Score: ${avgScore}/100`);
        console.log(`📊 Score Range: ${minScore} - ${maxScore}`);
        console.log(`⚡ Average Response Time: ${Math.round(recentData.reduce((sum, d) => sum + (d.responseTime || 0), 0) / recentData.length)}ms`);
      }

      break;
    }

    case 'alerts': {
      const historicalData = await monitor.loadHistoricalData();

      if (historicalData.length === 0) {
        console.log('❌ No historical data available');
        process.exit(1);
      }

      const lastEntry = historicalData[historicalData.length - 1];
      console.log(`\n🚨 CURRENT SEO ALERTS`);
      console.log('=====================');
      console.log(`Last Check: ${new Date(lastEntry.timestamp).toLocaleString()}`);
      console.log(`Overall Score: ${lastEntry.scores?.overall || 0}/100`);
      console.log(`Active Errors: ${lastEntry.errors?.length || 0}`);
      console.log(`Active Warnings: ${lastEntry.warnings?.length || 0}`);

      break;
    }

    default:
      console.error(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SEOPerformanceMonitor };