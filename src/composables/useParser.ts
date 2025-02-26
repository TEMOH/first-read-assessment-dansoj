import { ref } from 'vue'

export const useParser = ( ) => {
    
    const formattedFile = ref< string >( '' )
    
    const parseXML = ( xmlDocument: Document ) => {
        console.log( 'here' )
        let output = '';

        const paragraphs = xmlDocument.getElementsByTagName( 'w:p' );
        for ( let p of paragraphs ) {
            let textContent = ''
            let textStyle = ''
            let tag = 'p';
            let alignment = 'text-align: left;';
            
            const textNodes = p.getElementsByTagName( 'w:t' );
            const boldNodes = p.getElementsByTagName( 'w:b' );
            const italicNodes = p.getElementsByTagName( 'w:i' );
            const underlineNodes = p.getElementsByTagName( 'w:u' );
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
        
            // Detect lists
            if ( listNode ) {
                tag = 'li';
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
                if (imageUrl) {
                    output += `<img src='${imageUrl}' alt='Embedded Image' class='word-image' />`;
                }
            }
        }
        console.log( output )
        formattedFile.value = output;
    }

    return {
        formattedFile,
        parseXML
    }
}