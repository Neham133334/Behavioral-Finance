#!/bin/bash

echo "========================================"
echo "BEHAVIORAL FINANCE DASHBOARD CODE COPY"
echo "========================================"
echo ""
echo "This script will create a complete copy of all code files"
echo "with line numbers and detailed structure."
echo ""

# Create output directory
mkdir -p code_backup
cd code_backup

# Create main documentation file
echo "Creating complete code documentation..."
cat > complete_code.txt &lt;&lt; EOF
# BEHAVIORAL FINANCE DASHBOARD - COMPLETE CODE COPY
# Generated on $(date)
# ==================================================

EOF

# Function to add file with line numbers
add_file_with_lines() {
    local file_path="$1"
    local file_name="$2"
    
    if [ -f "$file_path" ]; then
        echo "### $file_name" >> complete_code.txt
        echo '```typescript' >> complete_code.txt
        nl -ba "$file_path" >> complete_code.txt
        echo '```' >> complete_code.txt
        echo "" >> complete_code.txt
    fi
}

# App Router Files
echo "## APP ROUTER FILES" >> complete_code.txt
echo "===================" >> complete_code.txt
echo "" >> complete_code.txt

add_file_with_lines "../app/layout.tsx" "app/layout.tsx"
add_file_with_lines "../app/page.tsx" "app/page.tsx"
add_file_with_lines "../app/globals.css" "app/globals.css"

# API Routes
echo "## API ROUTES" >> complete_code.txt
echo "=============" >> complete_code.txt
echo "" >> complete_code.txt

find ../app/api -name "route.ts" | while read -r file; do
    relative_path=${file#../}
    add_file_with_lines "$file" "$relative_path"
done

# Components
echo "## COMPONENTS" >> complete_code.txt
echo "=============" >> complete_code.txt
echo "" >> complete_code.txt

find ../components -maxdepth 1 -name "*.tsx" | while read -r file; do
    filename=$(basename "$file")
    add_file_with_lines "$file" "components/$filename"
done

# UI Components
echo "## UI COMPONENTS" >> complete_code.txt
echo "================" >> complete_code.txt
echo "" >> complete_code.txt

find ../components/ui -name "*.tsx" | while read -r file; do
    filename=$(basename "$file")
    add_file_with_lines "$file" "components/ui/$filename"
done

# Hooks
echo "## HOOKS" >> complete_code.txt
echo "========" >> complete_code.txt
echo "" >> complete_code.txt

find ../hooks -name "*.ts" | while read -r file; do
    filename=$(basename "$file")
    add_file_with_lines "$file" "hooks/$filename"
done

# Lib
echo "## LIBRARY FILES" >> complete_code.txt
echo "================" >> complete_code.txt
echo "" >> complete_code.txt

find ../lib -name "*.ts" | while read -r file; do
    filename=$(basename "$file")
    add_file_with_lines "$file" "lib/$filename"
done

# Configuration Files
echo "## CONFIGURATION FILES" >> complete_code.txt
echo "======================" >> complete_code.txt
echo "" >> complete_code.txt

add_file_with_lines "../package.json" "package.json"
add_file_with_lines "../tsconfig.json" "tsconfig.json"
add_file_with_lines "../tailwind.config.ts" "tailwind.config.ts"
add_file_with_lines "../next.config.mjs" "next.config.mjs"

# Create individual component directories
echo "Creating individual component files..."
mkdir -p components api_routes hooks lib

# Copy components individually
find ../components -maxdepth 1 -name "*.tsx" -exec cp {} components/ \;

# Copy API routes individually
find ../app/api -name "route.ts" | while read -r file; do
    dir_name=$(basename $(dirname "$file"))
    cp "$file" "api_routes/${dir_name}_route.ts"
done

# Copy hooks individually
find ../hooks -name "*.ts" -exec cp {} hooks/ \;

# Copy lib files individually
find ../lib -name "*.ts" -exec cp {} lib/ \;

# Create project structure file
echo "Creating project structure..."
cat > project_structure.txt &lt;&lt; EOF
# PROJECT STRUCTURE
==================

EOF
tree .. >> project_structure.txt 2>/dev/null || find .. -type f | sort >> project_structure.txt

# Create file count summary
echo "Creating file summary..."
cat > file_summary.txt &lt;&lt; EOF
# FILE SUMMARY
=============

Total TypeScript files: $(find .. -name "*.ts" -o -name "*.tsx" | wc -l)
Total JavaScript files: $(find .. -name "*.js" -o -name "*.jsx" | wc -l)
Total CSS files: $(find .. -name "*.css" | wc -l)
Total JSON files: $(find .. -name "*.json" | wc -l)
Total lines of code: $(find .. -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs wc -l | tail -1 | awk '{print $1}')

EOF

echo ""
echo "========================================"
echo "CODE COPY GENERATION COMPLETE!"
echo "========================================"
echo ""
echo "Files created in 'code_backup' folder:"
echo "- complete_code.txt (All code with line numbers)"
echo "- project_structure.txt (Directory tree)"
echo "- file_summary.txt (File count summary)"
echo "- components/ (Individual component files)"
echo "- api_routes/ (Individual API route files)"
echo "- hooks/ (Individual hook files)"
echo "- lib/ (Individual library files)"
echo ""
echo "Total lines of code: $(wc -l &lt; complete_code.txt)"
echo ""
