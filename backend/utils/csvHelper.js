// CSV Helper Parser
const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || '';
    });
    results.push(row);
  }
  return results;
};

module.exports = { parseCSV };
