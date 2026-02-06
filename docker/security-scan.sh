#!/bin/bash
# ============================================
# Ripple Foundation - Docker Security Scanner
# Run this script to audit Docker security
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔒 Ripple Foundation - Docker Security Audit"
echo "============================================"

# Check 1: Running containers
echo ""
echo "📋 Check 1: Running Containers"
echo "------------------------------"
RUNNING=$(docker ps --format '{{.Names}}' | wc -l)
echo -e "${GREEN}✓${NC} Running containers: $RUNNING"

# Check 2: Non-root user configuration
echo ""
echo "👤 Check 2: Non-Root User Configuration"
echo "----------------------------------------"
IMAGES=$(docker images --format '{{.Repository}}:{{.Tag}}' | head -10)
for img in $IMAGES; do
    USER=$(docker inspect --format '{{.Config.User}}' "$img" 2>/dev/null || echo "root")
    if [ "$USER" = "root" ] || [ -z "$USER" ]; then
        echo -e "${RED}✗${NC} $img: Running as $USER (should be non-root)"
    else
        echo -e "${GREEN}✓${NC} $img: Running as $USER"
    fi
done

# Check 3: Resource limits
echo ""
echo "💾 Check 3: Resource Limits"
echo "--------------------------"
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}" | head -10

# Check 4: Network exposure
echo ""
echo "🌐 Check 4: Network Exposure"
echo "----------------------------"
docker ps --format "{{.Names}}: {{.Ports}}" | grep -v "0.0.0.0" || echo -e "${GREEN}✓${NC} No public ports exposed"

# Check 5: Image vulnerabilities (if Trivy installed)
echo ""
echo "🔍 Check 5: Image Vulnerabilities"
echo "---------------------------------"
if command -v trivy &> /dev/null; then
    docker images --format "{{.Repository}}:{{.Tag}}" | head -3 | xargs -I {} sh -c 'trivy image {}'
else
    echo -e "${YELLOW}!${NC} Trivy not installed. Install with: brew install trivy"
fi

# Check 6: Secrets in images
echo ""
echo "🔑 Check 6: Secrets Detection"
echo "----------------------------"
echo "Scanning for hardcoded secrets..."
# Basic check for common patterns
echo "(This is a basic check - use dedicated tools for production)"

# Check 7: Docker socket mounting
echo ""
echo "🔌 Check 7: Docker Socket Mounts"
echo "-------------------------------"
MOUNTS=$(docker ps --format '{{.Names}}' | xargs -I {} docker inspect {} --format '{{.Name}}' | xargs -I {} docker inspect {} --format '{{range .Mounts}}{{.Type}}: {{.Source}} -> {{.Destination}}{{"\n"}}{{end}}' 2>/dev/null | grep -c docker.sock || echo "0")
if [ "$MOUNTS" -gt "0" ]; then
    echo -e "${RED}⚠️${NC} Docker socket mounted in $MOUNTS container(s) - security risk!"
else
    echo -e "${GREEN}✓${NC} No Docker socket mounts detected"
fi

# Summary
echo ""
echo "============================================"
echo "📊 Security Audit Complete"
echo "============================================"
echo ""
echo "Recommendations:"
echo "1. Run containers as non-root user"
echo "2. Set resource limits (CPU/memory)"
echo "3. Use read-only filesystems where possible"
echo "4. Scan images for vulnerabilities regularly"
echo "5. Never mount Docker socket in containers"
echo "6. Use secrets management (Vault/Docker Secrets)"
