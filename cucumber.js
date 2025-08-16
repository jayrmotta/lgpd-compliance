module.exports = {
  default: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    format: [
      'progress',
      'json:reports/cucumber_report.json'
    ],
    publishQuiet: true,
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 2, // Run 2 scenarios in parallel  
    timeout: 40000, // 40 seconds per step for initial loads
    retry: 0 // Remove retries for faster feedback
  }
}