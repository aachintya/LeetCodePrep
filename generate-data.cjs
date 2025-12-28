const fs = require('fs');
const path = require('path');

const dataDir = '../leetcode-companywise-interview-questions';
const timeframes = [
    { key: 'thirty-days', label: '30 Days', file: 'thirty-days.csv' },
    { key: 'three-months', label: '3 Months', file: 'three-months.csv' },
    { key: 'six-months', label: '6 Months', file: 'six-months.csv' },
    { key: 'more-than-six-months', label: 'More Than 6 Months', file: 'more-than-six-months.csv' },
    { key: 'all', label: 'All Time', file: 'all.csv' }
];

function parseCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length <= 1) return [];

    const questions = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const parts = [];
        let current = '';
        let inQuotes = false;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current);

        if (parts.length >= 6) {
            const [id, url, title, difficulty, acceptance, frequency] = parts;
            questions.push({
                id: parseInt(id) || 0,
                url: url.trim(),
                title: title.trim(),
                difficulty: difficulty.trim(),
                acceptance: parseFloat(acceptance) || 0,
                frequency: parseFloat(frequency) || 0
            });
        }
    }
    return questions;
}

const companies = [];
// Track unique questions per timeframe
const uniqueQuestionsByTimeframe = {};
timeframes.forEach(tf => uniqueQuestionsByTimeframe[tf.key] = new Set());

const items = fs.readdirSync(dataDir);

for (const item of items) {
    const itemPath = path.join(dataDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'src') {
        const companyData = {
            name: item,
            slug: item.toLowerCase().replace(/\s+/g, '-'),
            displayName: item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            timeframes: {}
        };

        let hasData = false;

        for (const tf of timeframes) {
            const csvPath = path.join(itemPath, tf.file);
            if (fs.existsSync(csvPath)) {
                const content = fs.readFileSync(csvPath, 'utf-8');
                const questions = parseCSV(content);

                if (questions.length > 0) {
                    hasData = true;
                    const easy = questions.filter(q => q.difficulty === 'Easy').length;
                    const medium = questions.filter(q => q.difficulty === 'Medium').length;
                    const hard = questions.filter(q => q.difficulty === 'Hard').length;

                    // Track unique questions
                    questions.forEach(q => uniqueQuestionsByTimeframe[tf.key].add(q.id));

                    companyData.timeframes[tf.key] = {
                        total: questions.length,
                        easy,
                        medium,
                        hard,
                        questions: questions.sort((a, b) => b.frequency - a.frequency)
                    };
                }
            }
        }

        if (hasData) {
            const allData = companyData.timeframes['all'] ||
                Object.values(companyData.timeframes).sort((a, b) => b.total - a.total)[0];
            companyData.total = allData.total;
            companyData.easy = allData.easy;
            companyData.medium = allData.medium;
            companyData.hard = allData.hard;
            companies.push(companyData);
        }
    }
}

companies.sort((a, b) => b.total - a.total);

// Build unique question counts per timeframe
const uniqueQuestions = {};
timeframes.forEach(tf => {
    uniqueQuestions[tf.key] = uniqueQuestionsByTimeframe[tf.key].size;
});

const output = {
    generated: new Date().toISOString(),
    totalCompanies: companies.length,
    uniqueQuestions, // Unique question counts by timeframe
    timeframes: timeframes.map(tf => ({ key: tf.key, label: tf.label })),
    companies
};

fs.writeFileSync('./public/data.json', JSON.stringify(output));
console.log(`Generated data.json with ${companies.length} companies`);
console.log('Unique questions by timeframe:');
timeframes.forEach(tf => {
    console.log(`  ${tf.label}: ${uniqueQuestions[tf.key]} unique questions`);
});
