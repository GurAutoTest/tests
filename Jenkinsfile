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

    success {
        emailext(
            subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
            <h2>Build SUCCESS</h2>

            <b>Job:</b> ${env.JOB_NAME}<br>
            <b>Build:</b> #${env.BUILD_NUMBER}<br>
            <b>Status:</b> SUCCESS<br><br>

            🔗 Build URL: ${env.BUILD_URL}<br>
            📊 Allure Report: ${env.BUILD_URL}allure<br><br>

            Regards,<br>
            Jenkins
            """,
            mimeType: 'text/html',
            to: 'YOUR_EMAIL@gmail.com'
        )
    }

    failure {
        emailext(
            subject: "❌ FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: """
            <h2>Build FAILED</h2>

            <b>Job:</b> ${env.JOB_NAME}<br>
            <b>Build:</b> #${env.BUILD_NUMBER}<br>
            <b>Status:</b> FAILURE<br><br>

            🔗 Build URL: ${env.BUILD_URL}<br>
            📊 Allure Report: ${env.BUILD_URL}allure<br><br>

            Check console logs for details.

            Regards,<br>
            Jenkins
            """,
            mimeType: 'text/html',
            to: 'YOUR_EMAIL@gmail.com'
        )
    }

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

        // Archive reports
        archiveArtifacts artifacts: '**/allure-report/**', allowEmptyArchive: true

        // Archive Excel file
        archiveArtifacts artifacts: 'test-data/*.xlsx', fingerprint: true
    }
}

 
}
