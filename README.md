# Open XML Parser - Vue 3 Application

## Overview

This project enables users to upload and parse Open XML documents, specifically `.xml` files exported from Microsoft Word. The application extracts and displays the document's structured content while preserving its formatting as closely as possible. The implementation is built using **Vue 3 with TypeScript**.

## Parsing Methodology

The application follows a structured parsing approach to extract and format document elements:

1. **File Upload & Reading**

   - A file input allows users to upload an Open XML document.
   - The uploaded file is read using `FileReader.readAsText()`.
   - The content is parsed into a `Document` object using `DOMParser.parseFromString()`.

2. **XML Parsing & Content Extraction**

   - **Paragraphs (****`<w:p>`****)**: Extracts text content while detecting bold, italic, underline styles.
   - **Headings (****`<w:pStyle>`****)**: Identifies and applies appropriate heading levels (e.g., `<h1>`, `<h2>`).
   - **Lists (****`<w:numPr>`****)**: Converts numbered and bulleted lists into `<ul>` or `<ol>` elements.
   - **Tables (****`<w:tbl>`****)**: Iterates through table rows (`<w:tr>`) and cells (`<w:tc>`) to generate an HTML `<table>`.
   - **Hyperlinks (****`<w:hyperlink>`****)**: Identifies linked text and wraps it with an `<a>` tag.
   - **Text Alignment (****`<w:jc>`****)**: Applies CSS-based text alignment (`left`, `center`, `right`, `justify`).

3. **Rendering the Extracted Content**

   - The extracted elements are converted into HTML and inserted into the Vue app using `v-html`.
   - The content is displayed inside a styled container while maintaining responsiveness.

## Challenges Encountered & Solutions Implemented

### 1. **Preserving Original Document Formatting**

**Issue:** The extracted text did not initially retain its original formatting (e.g., bold, italics, and lists).
**Solution:** Implemented a mapping system to convert Open XML styles into corresponding HTML elements with inline CSS.


### 2. **Extracting and Displaying Tables**

**Issue:** Word tables have nested structures that were not rendering correctly.
**Solution:** Implemented a recursive function to correctly parse and convert nested table elements into a structured `<table>` format.


## Assumptions Made During Development

- **Text Formatting Consistency**: Assumed that the Open XML document follows standard Word formatting conventions.
- **Image References Exist**: Assumed that embedded images have valid references within the document.
- **Standard Document Structure**: Assumed that headings, paragraphs, tables, and lists follow a consistent structure across different documents.
- **Page Break**: Assumed that pages of the document weren't spaced properly. Page break logic was paused due to inconsistent page spacing with makes getting the exact page count of the document difficult. The logic will be improved upon to capture edge cases

## Instructions for Running & Testing the Application

### **Prerequisites**

Ensure you have the following installed:

- **Node.js (v18+)**
- **Vue CLI**

### **Installation**

```sh
# Clone the repository
git clone https://github.com/TEMOH/first-read-assessment-dansoj.git

# Install dependencies
pnmp install
```

### **Running the Application**

```sh
pnpm run dev
```

This will start the application in development mode. Open `http://localhost:5173/` (or the provided local URL) in your browser.

### **Testing the File Upload & Parsing**

1. Open the application in your browser.
2. Click the **Upload File** button and select an Open XML `.xml` file.
3. The parsed content will be displayed, maintaining the document structure.
4. Scroll through to verify extracted headings, lists, tables, and images.

### **Building for Production**

```sh
npm run build
```

This generates an optimized build inside the `/dist` folder, ready for deployment.

## Conclusion

This application successfully extracts and formats Open XML documents into structured HTML while preserving styles, headings, lists, and images. Further improvements could include **support for embedded media files**, **getting exact document page count and styling accordingly** and **exporting parsed content back into Open XML format**.

