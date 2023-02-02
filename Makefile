#include .env

backend_dir = ./backend
frontend_dir = ./frontend

production_host_user = ec2-user
production_host_ip = 178.62.73.7
production_host_user = root
production_build_output = ./bin/goodle-linux-amd64
production_deployment_path = ~/Goodle/service
development_build_output = ./bin/goodle

run:
	cd ${backend_dir} && go run .

run/frontend:
	cd ${frontend_dir} && npm start


build/api:
	cd ${backend_dir} && go build -ldflags='-s' -o=${development_build_output} .
	cd ${backend_dir} && GOOS=linux GOARCH=amd64 go build -ldflags='-s' -o=${production_build_output} .

build/frontend:
	cd ${frontend_dir} && npm run-script build

audit:
	@echo 'Tidying and verifying module dependencies...'
	go mod tidy
	go mod verify
	@echo 'Formatting code...'
	go fmt ./...
	@echo 'Vetting code...'
	go vet ./...
	staticcheck ./...
	@echo 'Running tests...'
	go test -race -vet=off ./...


# ===========================================================
# Production - May need to ssh-add a key first if required.
# ===========================================================

connect: 
	ssh ${production_host_user}@${production_host_ip} 

# Ensure remote folder exists before trying or will break
deploy/api:
	@echo 'Deploying API service to production...'
	cd ${backend_dir} && rsync -P ${production_build_output} ${production_host_user}@${production_host_ip}:${production_deployment_path}
	rsync -P ${backend_dir}/remote/production/api.service ${production_host_user}@${production_host_ip}:~
	rsync -P ${backend_dir}/remote/production/Caddyfile ${production_host_user}@${production_host_ip}:~
	@echo 'Done!'
	@echo 'Restarting API Service!'
	ssh -t ${production_host_user}@${production_host_ip} '\
		sudo mv ~/api.service /etc/systemd/system/ \
		&& sudo systemctl enable api \
		&& sudo systemctl restart api \
		&& sudo mv ~/Caddyfile /etc/caddy/ \
		&& sudo systemctl reload caddy '

deploy/frontend:
	@echo 'Deploying Frontend to production...'
	aws s3 sync ${frontend_dir}/build s3://goodle.codestar.com --delete --profile codestar