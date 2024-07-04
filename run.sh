# chmod +x git.sh
#!/bin/bash -x
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

COMMIT='add mongodb test'

echo "${YELLOW}Pushing... ${NC}"

git add .
git commit -m "$COMMIT"
git push origin $(git rev-parse --abbrev-ref HEAD)

if [ $? -eq 0 ]; then
    echo "\n${CYAN}Pushed${NC}"
else
    echo "\n${RED}Push Error${NC}"
    exit 1
fi


