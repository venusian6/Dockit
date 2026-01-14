export function buildDeployCommand() {
  return `echo HELLO FROM SERVER
docker ps > /dev/null 2>&1 || exit 1
echo "docker is installed"
`;
}
