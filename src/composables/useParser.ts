import { ref } from 'vue'
import useRules from '@/utils/rules'

export const useParser = ( ) => {
    
    const formattedFile = ref< string >( '' )
    const { isValidURL } = useRules();

    const parseXML = ( xmlDocument: Document ) => {
        let output = '';
        
        const paragraphs = xmlDocument.getElementsByTagName( 'w:p' );
        for ( let p of paragraphs ) {
            let textContent = ''
            let textStyle = ''
            let tag = 'p';
            let alignment = 'text-align: left;';
            
            const textNodes = p.getElementsByTagName( 'w:t' );
            const hyperlinkNodes = p.getElementsByTagName('w:hyperlink');
            const boldNodes = p.getElementsByTagName( 'w:b' );
            const italicNodes = p.getElementsByTagName( 'w:i' );
            const underlineNodes = p.getElementsByTagName( 'w:u' );
            const highlightNodes = p.getElementsByTagName('w:highlight');
            const vertAlignNodes = p.getElementsByTagName('w:vertAlign');
            const styleNode = p.getElementsByTagName( 'w:pStyle' )[0];
            const listNode = p.getElementsByTagName( 'w:numPr' )[0];
            const alignNode = p.getElementsByTagName( 'w:jc' )[0];
            
            for (let t of textNodes) {
                textContent += t.textContent + ' ';
            }
            
            if ( boldNodes.length > 0 ) textStyle += 'font-weight: bold;';
            if ( italicNodes.length > 0 ) textStyle += 'font-style: italic;';
            if ( underlineNodes.length > 0 ) textStyle += 'text-decoration: underline;';
            
            // Detect text alignment
            if ( alignNode ) {
                const alignVal = alignNode.getAttribute( 'w:val' );
                if ( alignVal === 'center' ) alignment = 'text-align: center;';
                else if ( alignVal === 'right' ) alignment = 'text-align: right;';
                else if ( alignVal === 'both' ) alignment = 'text-align: justify;';
            }
            
            // Detect headings
            if ( styleNode ) {
                const styleVal = styleNode.getAttribute( 'w:val' );
                if ( styleVal?.includes( 'Heading' ) ) {
                    const level = styleVal.replace('Heading', '');
                    tag = `h${level}`;
                    textStyle += 'font-weight: bold; margin-top: 1em;';
                }
            }

            // Handle text highlighting (background color)
            if ( highlightNodes.length > 0 ) {
                const highlightColor = highlightNodes[0].getAttribute('w:val') || 'yellow';
                textStyle += `background-color: ${highlightColor};`;
            }

            // Handle superscript
            for (let vertAlign of vertAlignNodes) {
                const val = vertAlign.getAttribute('w:val');
                if (val === 'superscript') {
                    textStyle += 'vertical-align: super; font-size: 0.8em;';
                }
            }

        
            // Detect lists
            if ( listNode ) {
                tag = 'li';
            }

            // Handle Hyperlinks (Without `.rels`)
            if (hyperlinkNodes.length > 0) {
                for (let hyperlink of hyperlinkNodes) {
                    const relId = hyperlink.getAttribute('r:id');
                    let linkText = '';
                    const linkTextNodes = hyperlink.getElementsByTagName('w:t');
                    for (let lt of linkTextNodes) {
                        linkText += lt.textContent + ' ';
                    }
          
                    if (relId) {
                        textContent = `<a href='${ isValidURL( linkText.trim() ) ? linkText.trim() : '#' }' target="_blank" class="doc-link">${linkText.trim()}</a>`;
                    }
                }
            }
            
            if ( textContent.trim() ) {
                output += `<${tag} style='${textStyle} ${alignment}'>${textContent.trim()}</${tag}>`;
            }
        
        }

        // Extract and format tables with styling
        const tables = xmlDocument.getElementsByTagName( 'w:tbl' );
        for (let table of tables) {
            let tableHtml = '<table><tbody>';
            const rows = table.getElementsByTagName('w:tr');
            for (let row of rows) {
                tableHtml += '<tr>';
                const cells = row.getElementsByTagName('w:tc');
                for ( let cell of cells ) {
                    let cellText = '';
                    const textNodes = cell.getElementsByTagName('w:t');
                    for (let t of textNodes) {
                        cellText += t.textContent + ' ';
                    }
                    tableHtml += `<td>${cellText.trim()}</td>`;
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</tbody></table>';
            output += tableHtml;
        }

        // Extract images
        const drawings = xmlDocument.getElementsByTagName('w:drawing');
        for ( let drawing of drawings ) {
            const blip = drawing.getElementsByTagName('a:blip')[0];
            if (blip) {
                const imageUrl = blip.getAttribute('r:embed');
                // imageUrl should be mapped to media file
                if (imageUrl) {
                    output += `<img src='${imageUrl}' alt='Embedded Image' class='word-image' />`;
                }
            }
        }

        // Extract footers
        const footers = xmlDocument.getElementsByTagName('w:ftr');
        let footerContent = '';
        for ( let ftr of footers ) {
            let textNodes = ftr.getElementsByTagName('w:t');
            for ( let t of textNodes ) {
                footerContent += t.textContent + ' ';
            }
            if ( footerContent.trim() ) {
                output += `<footer class="doc-footer">${footerContent.trim()}</footer>`;
            }
        }

        formattedFile.value = output;
    }

    return {
        formattedFile,
        parseXML
    }
}