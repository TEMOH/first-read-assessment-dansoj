import { ref, type Ref } from 'vue'

interface UseOoxmlParserReturn {
    formattedFile: Ref<string>;
    parseXML: (xmlDocument: Document) => void;
}

interface Styles {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    alignment?: string;
}

export const useParser = (): UseOoxmlParserReturn => {
    // Reactive variable to store the converted HTML
    const formattedFile = ref('')

    // Function to parse the XML document and convert it to HTML
    const parseXML = ( xmlDocument: Document ) => {
        let currentListType: string | null = null;

        // Function to apply styles to text
        const applyStyles = ( textNode: Node, styles: Styles ) => {
            let styledText = textNode.textContent

            if (styles.bold) {
                styledText = `<strong>${styledText}</strong>`
            }
            if (styles.italic) {
                styledText = `<em>${styledText}</em>`
            }
            if (styles.underline) {
                styledText = `<u>${styledText}</u>`
            }
            if (styles.color) {
                styledText = `<span style='color: ${styles.color}'>${styledText}</span>`
            }
            if (styles.fontSize) {
                styledText = `<span style='font-size: ${styles.fontSize}'>${styledText}</span>`;
            }
            if (styles.fontFamily) {
                styledText = `<span style='font-family: ${styles.fontFamily}'>${styledText}</span>`;
            }
            if (styles.alignment) {
                styledText = `<div style='text-align: ${styles.alignment}'>${styledText}</div>`;
            }

            return styledText
        }

        // Function to parse run properties ( styles )
        const parseRunProperties = ( run: Element ):Styles => {
            const styles: Styles = {}
            const rPr = run.getElementsByTagName('w:rPr')[0]

            if ( rPr ) {
                if (rPr.getElementsByTagName('w:b').length > 0) {
                    styles.bold = true
                }
                if (rPr.getElementsByTagName('w:i').length > 0) {
                    styles.italic = true
                }
                if (rPr.getElementsByTagName('w:u').length > 0) {
                    styles.underline = true
                }
                const colorNode = rPr.getElementsByTagName('w:color')[0]
                if (colorNode && colorNode.getAttribute('w:val')) {
                    styles.color = `#${colorNode.getAttribute('w:val')}`
                }
                const fontSizeNode = rPr.getElementsByTagName('w:sz')[0];
                if (fontSizeNode && fontSizeNode.getAttribute('w:val')) {
                    styles.fontSize = `${parseInt(fontSizeNode.getAttribute('w:val')!) / 2}pt`;
                }
                const fontFamilyNode = rPr.getElementsByTagName('w:rFonts')[0];
                if (fontFamilyNode && fontFamilyNode.getAttribute('w:ascii')) {
                    styles.fontFamily = fontFamilyNode.getAttribute('w:ascii')!;
                }
            }

            return styles
        }

        // Function to parse paragraph properties (alignment)
        const parseParagraphProperties = ( paragraph: Element ): Styles => {
            const styles: Styles = {};
            const pPr = paragraph.getElementsByTagName('w:pPr')[0];
    
            if ( pPr ) {
                const alignNode = pPr.getElementsByTagName('w:jc')[0];
                if (alignNode && alignNode.getAttribute('w:val')) {
                    styles.alignment = alignNode.getAttribute('w:val')!;
                }
            }
            return styles;
        };
  

        // Function to convert XML nodes to HTML
        const parseNode = ( node: Node ) => {
            let html = ''

            if (node.nodeName === "w:p" && node instanceof Element) {
                const paragraphStyles = parseParagraphProperties(node);
                const numPr = node.getElementsByTagName("w:numPr")[0];
            
                // Check if the paragraph is part of a list
                if (numPr) {
                    const ilvl = numPr.getElementsByTagName("w:ilvl")[0];
                    const numId = numPr.getElementsByTagName("w:numId")[0];
                    if (ilvl && numId) {
                        const level = parseInt(ilvl.getAttribute("w:val")!);
                        const listType = level === 0 ? "ul" : "ol"; // Use <ul> for level 0, <ol> for others

                        // Start a new list if this is the first list item
                        if (!currentListType) {
                            currentListType = listType;
                            html += `<${currentListType}>`;
                        }

                        html += "<li>";
                        for (let child of Array.from(node.childNodes)) {
                            if (child.nodeName === "w:r" && child instanceof Element) {
                                const styles = parseRunProperties(child);
                                for (let textNode of Array.from(child.childNodes)) {
                                    if (textNode.nodeName === "w:t") {
                                        html += applyStyles(textNode, styles);
                                    }
                                }
                            }
                        }
                        html += "</li>";

                        const nextSibling = node.nextElementSibling;

                        if ( !nextSibling || !nextSibling.getElementsByTagName("w:numPr")[0] ) {
                            html += `</${currentListType}>`;
                            currentListType = null; // Reset the current list type
                        }
                        return html; // Return early for list items
                    }
                }
            
                // Handle regular paragraphs (not part of a list)
                html += `<p style="text-align: ${paragraphStyles.alignment || "left"}">`;
                for (let child of Array.from(node.childNodes)) {
                    if (child.nodeName === "w:r" && child instanceof Element) {
                        const styles = parseRunProperties(child);
                        for (let textNode of Array.from(child.childNodes)) {
                            if (textNode.nodeName === "w:t") {
                                html += applyStyles(textNode, styles);
                            }
                        }
                    }
                }
                html += "</p>";
            }

            // Handle tables
            if ( node.nodeName === 'w:tbl' && node instanceof Element ) {
                html += "<table border='1'>"
                for ( let row of Array.from( node.getElementsByTagName( 'w:tr' ) ) ) {
                    html += '<tr>'
                    for ( let cell of Array.from( row.getElementsByTagName('w:tc') ) ) {
                        html += '<td>'
                        for ( let para of Array.from( cell.getElementsByTagName('w:p') ) ) {
                            html += parseNode( para )
                        }
                        html += '</td>'
                    }
                    html += '</tr>'
                }
                html += '</table>'
            }

            return html
        }

        // Start parsing from the document body
        const body = xmlDocument.getElementsByTagName('w:body')[0]
        let html = '<html><head><title>Converted XML to HTML</title></head><body>'
        for (const child of body.childNodes) {
            html += parseNode(child)
        }
        html += '</body></html>'

        // Update the reactive formattedFile
        formattedFile.value = html
    }

    // Return the reactive formattedFile and the parseXML function
    return {
        formattedFile,
        parseXML,
    }
}
