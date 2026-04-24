#!/bin/bash
# AEM Page Authoring Script
# Creates pages with blocks on the AEM Author instance via Sling POST Servlet

set -e

TOKEN="$1"
HOST="https://author-p24152-e1275188.adobeaemcloud.com"
SITE="/content/EMA_SAMPLE_PROJECT"

if [ -z "$TOKEN" ]; then
  echo "Usage: $0 <bearer-token>"
  exit 1
fi

post() {
  local path="$1"
  shift
  local response
  response=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" "$@" "$HOST$path")
  local http_code=$(echo "$response" | tail -1)
  local body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo "  ✅ Created: $path (HTTP $http_code)"
  else
    echo "  ❌ Failed: $path (HTTP $http_code)"
    echo "  $body" | head -5
    return 1
  fi
}

echo "================================================"
echo "  AEM Page Authoring: Mica Product Page"
echo "================================================"
echo ""

PAGE_PATH="$SITE/mica"

# Step 1: Create page node (cq:Page)
echo "Step 1: Creating page node..."
post "$PAGE_PATH" \
  -F "jcr:primaryType=cq:Page"

# Step 2: Create jcr:content with page properties
echo "Step 2: Setting page properties..."
post "$PAGE_PATH/jcr:content" \
  -F "jcr:primaryType=cq:PageContent" \
  -F "jcr:title=Mica" \
  -F "pageTitle=Mica - Next Generation Compound Microscope" \
  -F "jcr:description=Discover the Mica compound microscope featuring advanced fluorescence imaging, motorized objectives, and intuitive touchscreen control." \
  -F "sling:resourceType=core/franklin/components/page/v1/page" \
  -F "cq:template=/libs/core/franklin/templates/page"

# Step 3: Create root container
echo "Step 3: Creating root container..."
post "$PAGE_PATH/jcr:content/root" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/root/v1/root"

# Step 4: Create Section 1 (Hero Banner)
echo "Step 4: Creating Section 1 (Hero Banner)..."
post "$PAGE_PATH/jcr:content/root/section" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/section/v1/section"

post "$PAGE_PATH/jcr:content/root/section/hero-banner" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/block/v1/block" \
  -F "name=Hero Banner" \
  -F "model=hero-banner" \
  -F "image=/content/dam/EMA_SAMPLE_PROJECT/mica-hero-background.jpg" \
  -F "imageAlt=Microscope laboratory background" \
  -F "text=<h1>Welcome to Mica</h1><p>The next generation compound microscope designed for precision imaging and intuitive workflows in life science research.</p><p><a href=\"/content/EMA_SAMPLE_PROJECT/mica#features\">Explore Features</a></p>"

# Step 5: Create Section 2 (Accordion)
echo "Step 5: Creating Section 2 (Accordion)..."
post "$PAGE_PATH/jcr:content/root/section_0" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/section/v1/section"

post "$PAGE_PATH/jcr:content/root/section_0/accordion" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/block/v1/block" \
  -F "name=Accordion" \
  -F "model=accordion" \
  -F "rows=3"

# Accordion item 1: Features
post "$PAGE_PATH/jcr:content/root/section_0/accordion/row1" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row1/col1" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "title=Features" \
  -F "sling:resourceType=core/franklin/components/title/v1/title" \
  -F "titleType=h3"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row1/col2" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row1/col2/text" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/text/v1/text" \
  -F "text=<p>Mica delivers exceptional optical clarity with a fully motorized nosepiece supporting up to 6 objectives. The integrated fluorescence illumination system enables multi-channel imaging with seamless switching between brightfield, phase contrast, and fluorescence modalities. An intuitive touchscreen interface allows researchers to configure acquisition parameters without leaving the eyepiece.</p>"

# Accordion item 2: Specifications
post "$PAGE_PATH/jcr:content/root/section_0/accordion/row2" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row2/col1" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "title=Specifications" \
  -F "sling:resourceType=core/franklin/components/title/v1/title" \
  -F "titleType=h3"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row2/col2" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row2/col2/text" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/text/v1/text" \
  -F "text=<p>Magnification range: 1.25x to 100x (oil immersion). Camera: 4.2 megapixel sCMOS sensor with 6.5 µm pixel size. Stage travel: 130 × 85 mm with sub-micron repeatability. Fluorescence filters: DAPI, FITC, TRITC, Cy5 standard; additional filter cubes available. Connectivity: USB 3.0, Ethernet, Wi-Fi 6. Dimensions: 520 × 460 × 580 mm. Weight: 32 kg.</p>"

# Accordion item 3: Warranty
post "$PAGE_PATH/jcr:content/root/section_0/accordion/row3" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row3/col1" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "title=Warranty" \
  -F "sling:resourceType=core/franklin/components/title/v1/title" \
  -F "titleType=h3"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row3/col2" \
  -F "jcr:primaryType=nt:unstructured"

post "$PAGE_PATH/jcr:content/root/section_0/accordion/row3/col2/text" \
  -F "jcr:primaryType=nt:unstructured" \
  -F "sling:resourceType=core/franklin/components/text/v1/text" \
  -F "text=<p>Every Mica microscope is backed by a comprehensive 3-year manufacturer warranty covering all optical and mechanical components. Extended service agreements are available for up to 5 years and include annual preventive maintenance, priority on-site support, and firmware updates. Contact your local representative for a tailored service plan.</p>"

echo ""
echo "================================================"
echo "  ✅ Page created at: $PAGE_PATH"
echo "================================================"
echo ""

# Step 6: Verify
echo "Step 6: Verifying page exists..."
VERIFY=$(curl -s -w "%{http_code}" -o /dev/null -H "Authorization: Bearer $TOKEN" "$HOST$PAGE_PATH.json")
echo "  Page node: HTTP $VERIFY"

VERIFY_CONTENT=$(curl -s -H "Authorization: Bearer $TOKEN" "$HOST$PAGE_PATH/jcr:content.json" 2>&1)
if echo "$VERIFY_CONTENT" | grep -q "Mica"; then
  echo "  ✅ jcr:content verified - title 'Mica' found"
else
  echo "  ⚠️  Could not verify jcr:content"
fi

echo ""
echo "Page URL: $HOST/editor.html$PAGE_PATH.html"
echo "Preview:  https://main--sta-xwalk-boilerplate--aemysites.aem.page/mica"
