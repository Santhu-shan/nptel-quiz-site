const fs = require('fs');

function parseFile(filename, yearPrefix) {
    const raw = fs.readFileSync(filename, 'utf8');
    const assignmentBlocks = raw.split(/January 202[56]\s*-?\s*\d+ Assignment|January 202[56]\s*Assignment-\d+/).slice(1);
    
    const weeks = [];
    
    for (let i = 0; i < assignmentBlocks.length; i++) {
        const block = assignmentBlocks[i];
        const weekNumber = i + 1;
        
        const questionBlocks = block.split(/QUESTION \d+:/).filter(b => b.trim().length > 0);
        const questions = [];
        
        for (let qBlock of questionBlocks) {
            if (!qBlock.includes('Ans.')) continue;
            
            const lines = qBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            let textLines = [];
            let options = [];
            let ansLine = '';
            
            let state = 'text'; // text, options, ans
            
            for (let line of lines) {
                // Ignore Solution completely
                if (line.startsWith('Solution:')) {
                    state = 'ignore';
                    continue;
                }

                if (line.match(/^[A-E]\./)) {
                    state = 'options';
                    options.push(line.substring(2).trim());
                } else if (line.startsWith('Ans.')) {
                    state = 'ans';
                    ansLine = line;
                } else if (line.startsWith('************END**********')) {
                    break;
                } else if (line.startsWith('NPTEL Online Certification Courses') || 
                           line.startsWith('Indian Institute of Technology Kharagpur') ||
                           line.startsWith('Education for Sustainable Development') ||
                           line.includes('Assignment') ||
                           line.startsWith('TYPE OF QUESTION') ||
                           line.startsWith('Number of questions:') ||
                           line.startsWith('_______________________________________')) {
                    continue;
                } else {
                    if (state === 'text') {
                        // remove Q1. prefix if exists
                        let cleanLine = line.replace(/^Q\d+\.\s*/, '');
                        textLines.push(cleanLine);
                    } else if (state === 'options') {
                       options[options.length-1] += ' ' + line;
                    }
                }
            }
            
            const text = textLines.join(' ');
            
            let correctAnswerIndex = 0;
            const ansMatch = ansLine.match(/Ans\.\s*([A-E])/);
            if (ansMatch) {
                correctAnswerIndex = ansMatch[1].charCodeAt(0) - 65;
            }
            
            if (text.length > 0 && options.length > 0) {
                questions.push({
                    id: `${yearPrefix}-w${weekNumber}-q${questions.length + 1}`,
                    text: text,
                    options: options,
                    correctAnswer: correctAnswerIndex
                    // explanation removed
                });
            }
        }
        
        if (questions.length > 0) {
            weeks.push({
                id: `${yearPrefix}-week-${weekNumber}`,
                title: `Week ${weekNumber}`,
                description: `Assignment ${weekNumber} Questions`,
                questions: questions
            });
        }
    }
    return weeks;
}

const weeks2025 = parseFile('raw.txt', '2025');
const weeks2026 = parseFile('raw2026.txt', '2026');

const courses = [
  {
    id: 'esd',
    title: 'Education for Sustainable Development',
    description: 'NPTEL Certification Course',
    icon: '🌍',
    years: [
      {
        id: 'esd-2025',
        title: '2025',
        description: 'January 2025 Session',
        weeks: weeks2025
      },
      {
        id: 'esd-2026',
        title: '2026',
        description: 'January 2026 Session',
        weeks: weeks2026
      }
    ]
  }
];

const jsContent = `export const data = ${JSON.stringify(courses, null, 2)};\n`;
fs.writeFileSync('src/data.js', jsContent);
console.log('Successfully generated src/data.js with structured hierarchy.');
