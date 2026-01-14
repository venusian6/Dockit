export function buildDeployCommand() {
  return `

docker ps > /dev/null 2>&1 || exit 1
echo "docker is installed"
`;
}
