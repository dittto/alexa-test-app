FROM            debian:8

# Install basic software for server
RUN             apt-get update && \
                apt-get upgrade -y && \
                apt-get install -y \
                    curl \
                    git \
                    vim \
                    wget

# Install node and serverless
RUN             curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh && \
                bash nodesource_setup.sh && \
                apt-get install -y \
                    nodejs \
                    build-essential && \
                npm install serverless -g

# adds aws command line
RUN             curl -O https://bootstrap.pypa.io/get-pip.py && \
                python get-pip.py && \
                pip install awscli
COPY            ./etc/aws.config ~/.aws/config
COPY            ./etc/aws.credentials ~/.aws/credentials

# Clean apt-get
RUN             apt-get clean && \
                rm -rf /var/lib/apt/lists/*

# Fix vim controls
RUN             echo "set term=xterm-256color" >> ~/.vimrc

WORKDIR         /var/alexa-test
CMD             ["tail", "-F", "-n0", "/etc/hosts"]