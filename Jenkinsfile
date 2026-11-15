pipeline {
    agent { label 'control' }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    parameters {
        choice(
            name: 'ACTION',
            choices: ['build', 'deploy'],
            description: 'Build new images or deploy existing images'
        )

        string(
            name: 'DEPLOY_TAG',
            defaultValue: '',
            description: 'Required only when ACTION=deploy'
        )
    }

    environment {
        COMPOSE_ENV = credentials('restaurant-env')
        DOCKERHUB = credentials('dockerhub')
        REGISTRY_USER = "${DOCKERHUB_USR}"
        REGISTRY_URL = 'docker.io'
        REGISTRY_PROJECT = 'restaurant'
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    env.DO_DEPLOY = 'false'
                    if (params.ACTION == 'build') {
                        def ref = env.gitlabSourceBranch ?: ''
                        if (!ref.startsWith('refs/tags/')) {
                            error 'Build requires a GitLab tag webhook'
                        }
                        def version = ref.substring('refs/tags/'.length())
                        def sha = sh(
                            script: 'git rev-parse --short=8 HEAD',
                            returnStdout: true
                        ).trim()
                        env.IMAGE_TAG = "${version}_${sha}"
                    } else {
                        env.IMAGE_TAG = params.DEPLOY_TAG.trim()
                        env.DO_DEPLOY = 'true'
                    }

                    if (!(env.IMAGE_TAG ==~ /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/)) {
                        error 'Invalid IMAGE_TAG'
                    }
                }

                echo "ACTION: ${params.ACTION}"
                echo "IMAGE_TAG: ${env.IMAGE_TAG}"
            }
        }

        stage('Build Images') {
            when {
                expression { params.ACTION == 'build' }
            }

            steps {
                sh '''
                    set -eu

                    docker compose \
                        --env-file "$COMPOSE_ENV" \
                        build --parallel --pull be fe
                '''
            }
        }

        stage('Push Images') {
            when {
                expression { params.ACTION == 'build' }
            }

            steps {
                sh '''
                    set -eu
                    set +x

                    DOCKER_CONFIG="$(mktemp -d)"
                    export DOCKER_CONFIG
                    trap 'rm -rf "$DOCKER_CONFIG"' EXIT

                    printf '%s' "$DOCKERHUB_PSW" |
                        docker login "$REGISTRY_URL" \
                            -u "$REGISTRY_USER" \
                            --password-stdin

                    docker compose \
                        --env-file "$COMPOSE_ENV" \
                        push be fe
                '''
            }
        }

        stage('Deploy Approval') {
            when {
                expression { params.ACTION == 'build' }
            }

            steps {
                script {
                    def decision = input(
                        message: "Deploy ${env.IMAGE_TAG}?",
                        ok: 'Confirm',
                        parameters: [
                            choice(
                                name: 'DECISION',
                                choices: ['Deploy', 'Skip'],
                                description: 'Choose next action'
                            )
                        ]
                    )

                    env.DO_DEPLOY =
                        decision == 'Deploy' ? 'true' : 'false'
                    echo "Decision: ${decision}; DO_DEPLOY: ${env.DO_DEPLOY}"
                }
            }
        }

        stage('Pull Images') {
            when {
                expression { env.DO_DEPLOY == 'true' }
            }

            steps {
                sh '''
                    set -eu
                    set +x

                    DOCKER_CONFIG="$(mktemp -d)"
                    export DOCKER_CONFIG
                    trap 'rm -rf "$DOCKER_CONFIG"' EXIT

                    printf '%s' "$DOCKERHUB_PSW" |
                        docker login "$REGISTRY_URL" \
                            -u "$REGISTRY_USER" \
                            --password-stdin

                    docker compose \
                        --env-file "$COMPOSE_ENV" \
                        -p restaurant \
                        pull be fe
                '''
            }
        }

        stage('Deploy') {
            when {
                expression { env.DO_DEPLOY == 'true' }
            }

            steps {
                sh '''
                    set -eu

                    docker compose \
                        --env-file "$COMPOSE_ENV" \
                        -p restaurant \
                        up -d --no-build
                '''
            }
        }

        stage('Verify') {
            when {
                expression { env.DO_DEPLOY == 'true' }
            }

            steps {
                sh '''
                    set -eu

                    for container in mydb mybe myfe; do
                        echo "Checking $container..."

                        healthy=0

                        for i in $(seq 1 30); do
                            status="$(docker inspect \
                                --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' \
                                "$container" 2>/dev/null || true)"

                            if [ "$status" = "healthy" ]; then
                                healthy=1
                                break
                            fi

                            sleep 5
                        done

                        if [ "$healthy" -ne 1 ]; then
                            echo "ERROR: $container is not healthy"
                            exit 1
                        fi
                    done

                    echo "All containers are healthy"
                '''
            }
        }
    }

    post {
        success {
            echo "SUCCESS: ${params.ACTION} - ${env.IMAGE_TAG}"
        }

        failure {
            echo "FAILED: ${params.ACTION}"
        }
    }
}
