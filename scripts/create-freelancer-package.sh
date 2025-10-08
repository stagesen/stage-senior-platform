#!/bin/bash

# Script to create a freelancer package with all necessary files

echo "📦 Creating Freelancer Package..."

# Create package directory
PACKAGE_DIR="freelancer-package"
mkdir -p "$PACKAGE_DIR"

# Copy CSV templates
echo "📄 Copying CSV templates..."
cp community-data-template.csv "$PACKAGE_DIR/"
cp community-team-members-template.csv "$PACKAGE_DIR/"
cp community-faqs-template.csv "$PACKAGE_DIR/"
cp community-galleries-template.csv "$PACKAGE_DIR/"
cp community-highlights-template.csv "$PACKAGE_DIR/"
cp community-features-template.csv "$PACKAGE_DIR/"
cp community-testimonials-template.csv "$PACKAGE_DIR/"
cp community-floor-plans-template.csv "$PACKAGE_DIR/"
cp community-events-template.csv "$PACKAGE_DIR/"

# Copy documentation
echo "📖 Copying documentation..."
cp COMMUNITY-DATA-UPLOAD-INSTRUCTIONS.md "$PACKAGE_DIR/"
cp FREELANCER-DELIVERABLES.md "$PACKAGE_DIR/"
cp content-collection-checklist.csv "$PACKAGE_DIR/"

# Create a README for the package
cat > "$PACKAGE_DIR/README.txt" << 'EOF'
COMMUNITY DATA ENTRY PROJECT
============================

Welcome! This folder contains everything you need to complete the community data entry project.

WHAT TO READ FIRST:
1. Start with COMMUNITY-DATA-UPLOAD-INSTRUCTIONS.md - Complete instructions
2. Review content-collection-checklist.csv - Detailed checklist of what's needed
3. Read FREELANCER-DELIVERABLES.md - What to submit when finished

WHAT TO COMPLETE:
Fill in data for these 4 communities:
- Gardens at Columbine (Littleton, CO)
- The Gardens on Quail (Arvada, CO)
- Stonebridge Senior (Arvada, CO)
- Note: Golden Pond is already completed as an example

FILES TO FILL OUT (9 CSV files):
1. community-data-template.csv
2. community-team-members-template.csv
3. community-faqs-template.csv
4. community-galleries-template.csv
5. community-highlights-template.csv
6. community-features-template.csv
7. community-testimonials-template.csv
8. community-floor-plans-template.csv
9. community-events-template.csv

ESTIMATED TIME: 40-48 hours total (10-12 hours per community)

IMPORTANT NOTES:
- Golden Pond (first row) is filled in as an example - use it as a reference
- Open CSVs in Excel, Google Sheets, or any spreadsheet program
- Keep the header row (first row) exactly as is
- All descriptions must be unique - don't copy/paste between communities!
- Upload all images to a shared folder and provide URLs in the CSV

QUESTIONS?
Contact: [ADD YOUR EMAIL/PHONE HERE]

Good luck!
EOF

# Create a zip file
echo "🗜️  Creating zip archive..."
zip -r freelancer-package.zip "$PACKAGE_DIR"

echo ""
echo "✅ Package created successfully!"
echo ""
echo "📦 Package location: ./freelancer-package.zip"
echo "📂 Unzipped folder: ./freelancer-package/"
echo ""
echo "Next steps:"
echo "1. Update contact info in $PACKAGE_DIR/README.txt"
echo "2. Send freelancer-package.zip to your freelancer"
echo "3. When they return the completed CSVs, place them in the project root"
echo "4. Run: npm run import:community-data"
echo ""
