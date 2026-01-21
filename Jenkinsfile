pipeline {
    agent any

    tools {
        // Ensure Node.js is configured in Jenkins Global Tool Configuration
        nodejs 'node' 
    }

    stages {
        stage('Checkout') {
            steps {
                // Usually handled automatically by Jenkins if using a Git repo
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Excel Driven Tests') {
            steps {
                // Using the script we just added to package.json
                sh 'npm run test:excel'
            }
        }
    }

    post {
        always {
            // Archive Playwright HTML report
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])

            // Archive the updated Excel result file as an artifact
            archiveArtifacts artifacts: 'test-data/*.xlsx', fingerprint: true
        }
    }
}
