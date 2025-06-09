pipeline {
    agent any

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/BoyanGerasimov/TaskFlow.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir("${env.BACKEND_DIR}") {
                    sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    export PYTHONPATH=$PYTHONPATH:$(pwd)
                    pip install -r ../requirements.txt
                    pytest
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    try {
                        sh 'docker compose up -d --build'
                        echo 'Docker Compose started successfully'
                    } catch (Exception e) {
                        echo "Warning: Docker Compose failed - ${e.getMessage()}"
                        echo "This may be due to Docker permissions. Please configure Jenkins Docker access."
                        echo "The application builds and tests passed successfully."
                        // Don't fail the pipeline for Docker issues if tests passed
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo 'All stages completed successfully!'
        }
        unstable {
            echo 'Build completed with warnings (Docker permissions issue)'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}