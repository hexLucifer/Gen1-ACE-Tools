const inputBox = document.getElementById('inputBox');
const keytable = {
    // Pokémon Gen1 hex codes
    'A': '80', 'B': '81', 'C': '82', 'D': '83', 'E': '84', 'F': '85', 'G': '86', 'H': '87', 'I': '88', 'J': '89',
    'K': '8A', 'L': '8B', 'M': '8C', 'N': '8D', 'O': '8E', 'P': '8F', 'Q': '90', 'R': '91', 'S': '92', 'T': '93',
    'U': '94', 'V': '95', 'W': '96', 'X': '97', 'Y': '98', 'Z': '99',

    'a': 'A0', 'b': 'A1', 'c': 'A2', 'd': 'A3', 'e': 'A4', 'f': 'A5', 'g': 'A6', 'h': 'A7', 'i': 'A8', 'j': 'A9',
    'k': 'AA', 'l': 'AB', 'm': 'AC', 'n': 'AD', 'o': 'AE', 'p': 'AF',

    'q': 'B0', 'r': 'B1', 's': 'B2', 't': 'B3', 'u': 'B4', 'v': 'B5', 'w': 'B6', 'x': 'B7', 'y': 'B8', 'z': 'B9',

    ' ': 'F7', '(': '9A', ')': '9B', ':': '9C', ';': '9D', '[': '9E', ']': '9F', '\'': 'E0', '.': 'F2',
    '/': 'F3', ',': 'F4',

    '0': 'F6', '1': 'F7', '2': 'F8', '3': 'F9', '4': 'FA', '5': 'FB', '6': 'FC', '7': 'FD', '8': 'FE', '9': 'FF'
};

const gridContainer = document.querySelector('.grid-container');

const toggleSwitch = document.getElementById('toggleSwitch');

// Set the toggle switch to checked on page load
window.addEventListener('load', () => {
  toggleSwitch.checked = true;
});

for (let i = 0; i < 400; i++) {
  const square = document.createElement('div');
  square.classList.add('grid-square');
  square.addEventListener('click', (event) => {
    if (toggleSwitch.checked) {
      event.stopPropagation();
      openMenu(square);
    }
  });
  gridContainer.appendChild(square);
}

toggleSwitch.addEventListener('change', () => {
  const squares = document.querySelectorAll('.grid-square');
  squares.forEach(square => {
    if (toggleSwitch.checked) {
        inputBox.removeAttribute('readonly');
      square.addEventListener('click', (event) => {
        event.stopPropagation();
        openMenu(square);
      });
    } else {
      inputBox.setAttribute('readonly', 'readonly');
      square.removeEventListener('click', (event) => {
        event.stopPropagation();
        openMenu(square);
      });
    }
  });
});

  

function openMenu(square) {
    // Create a new div element for the menu
    const menu = document.createElement('div');
    menu.classList.add('menu');
  
    // Add menu items or content as needed
    menu.innerHTML = `
      <div class="menu-item">Menu Item 1</div>
      <div class="menu-item">Menu Item 2</div>
      <div class="menu-item">Menu Item 3</div>
    `;
  
    // Append the menu to the square
    square.appendChild(menu);
  
    // Add an event listener to close the menu when clicked outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.grid-square')) {
        closeMenu(menu);
      }
    });
  }
  
  function closeMenu(menu) {
    // Remove the menu from the DOM
    menu.parentNode.removeChild(menu);
  }
  

document.addEventListener('DOMContentLoaded', function() {
    const outputBox = document.getElementById('outputBox');

    inputBox.addEventListener('input', function() {
        translateText();
        limitCharactersPerLine(inputBox);
    });
});

function translateText() {
    const inputBoxElement = document.getElementById('inputBox');
    const outputBox = document.getElementById('outputBox');

    let inputText = inputBoxElement.value;
    let translatedText = '';

    for (let char of inputText) {
        if (keytable[char]) {
            translatedText += keytable[char];
        } else {
            translatedText += char; // Handle characters not in keytable (if needed)
        }
    }

    // Add padding to each line to make it divisible by 40 characters
    const paddedLines = translatedText.split('\n').map(line => {
        let paddedLine = line;
        if (line.length % 40 !== 0) {
            paddedLine += '7F'.repeat(40 - (line.length % 40));
        }
        return paddedLine;
    });

    outputBox.value = paddedLines.join('\n');
}

function copyText() {
    const outputBox = document.getElementById('outputBox');
    outputBox.select();
    outputBox.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");
    alert("Text copied to clipboard!");
}

function limitCharactersPerLine(textarea) {
    const maxLengthPerLine = 20; // Maximum characters per line

    textarea.addEventListener('input', function() {
        const cursorPosition = this.selectionStart;
        const oldValue = this.value;
        let newValue = '';

        // Split text into lines
        const lines = oldValue.split('\n');

        // Iterate through each line to apply character limit
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].length > maxLengthPerLine) {
                // Split line into segments that fit the limit
                let newLines = [];
                let currentLine = '';

                for (let j = 0; j < lines[i].length; j++) {
                    currentLine += lines[i][j];
                    if (currentLine.length === maxLengthPerLine) {
                        newLines.push(currentLine);
                        currentLine = '';
                    }
                }

                // Add remaining characters as new line
                if (currentLine.length > 0) {
                    newLines.push(currentLine);
                }

                // Update lines array with new lines
                lines.splice(i, 1, ...newLines);

                // Restore cursor position
                if (cursorPosition > oldValue.length) {
                    newValue = lines.join('\n');
                } else {
                    let cursorOffset = 0;
                    for (let k = 0; k < i; k++) {
                        cursorOffset += lines[k].length + 1; // +1 for newline character
                    }
                    cursorOffset += cursorPosition - (lines.slice(0, i).join('\n').length + 1);

                    newValue = lines.join('\n');

                    textarea.setSelectionRange(cursorOffset, cursorOffset);
                }
            }
        }

        if (newValue === '') {
            newValue = lines.join('\n');
        }

        // Set new value
        this.value = newValue;
    });
}
