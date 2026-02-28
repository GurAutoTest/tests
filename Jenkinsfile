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

        // Allure report (safe execution)
        script {
            catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']]
                ])
            }
        }

        // Archive Excel file
        archiveArtifacts artifacts: 'test-data/*.xlsx', fingerprint: true
    }
}

 
}
