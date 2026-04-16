#!/bin/bash
# Deployment status check script

echo "=========================================="
echo "Chinese Name Generator - Deployment Check"
echo "=========================================="
echo ""

# Check frontend
echo "1. Checking Frontend (Cloudflare Pages)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://chinesename.uichain.org/)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is accessible (HTTP $FRONTEND_STATUS)"
else
    echo "   ❌ Frontend returned HTTP $FRONTEND_STATUS"
fi
echo ""

# Check API (will fail until Worker is deployed)
echo "2. Checking API Worker..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"englishName":"Test"}' \
    https://chinesename.uichain.org/api/generate 2>/dev/null || echo "000")

if [ "$API_STATUS" = "200" ]; then
    echo "   ✅ API is working (HTTP $API_STATUS)"
elif [ "$API_STATUS" = "405" ]; then
    echo "   ⚠️  API returns 405 - Worker may not be deployed yet"
    echo "   💡 Solution: Check GitHub Actions and ensure Worker is deployed"
else
    echo "   ❌ API check failed (HTTP $API_STATUS)"
fi
echo ""

# Show current git status
echo "3. Git Status:"
git log --oneline -3
echo ""

# Show recent commits
echo "4. Recent Changes:"
git log --oneline --since="1 day ago" 2>/dev/null || echo "   (Unable to fetch git log)"
echo ""

echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo "1. Visit https://github.com/leo-bone/chinesename/actions"
echo "2. Check if 'Deploy API Worker' workflow succeeded"
echo "3. If successful, get the Worker URL from Cloudflare Dashboard"
echo "4. Add the Worker URL to GitHub Secrets as NEXT_PUBLIC_API_URL"
echo "5. Redeploy the frontend"
echo "=========================================="
