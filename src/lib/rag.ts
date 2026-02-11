import fs from 'fs';
import path from 'path';

// Simple cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

// Simple text embedding using TF-IDF-like approach
function simpleEmbed(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: { [key: string]: number } = {};
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Create a simple 100-dimensional vector
  const vector = new Array(100).fill(0);
  Object.keys(wordFreq).forEach((word, idx) => {
    const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    vector[hash % 100] += wordFreq[word];
  });
  
  // Normalize
  const mag = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(v => v / (mag || 1));
}

export interface CVChunk {
  content: string;
  embedding: number[];
  section: string;
}

let cvChunks: CVChunk[] | null = null;

export function loadCV(): CVChunk[] {
  if (cvChunks) return cvChunks;

  try {
    const cvPath = path.join(process.cwd(), 'src', 'data', 'cv.txt');
    const cvContent = fs.readFileSync(cvPath, 'utf-8');

    // Split CV into sections
    const sections = cvContent.split('\n\n');
    
    cvChunks = sections
      .filter(section => section.trim().length > 50) // Filter out very short sections
      .map(section => ({
        content: section.trim(),
        embedding: simpleEmbed(section),
        section: section.split('\n')[0].trim() // First line as section header
      }));

    console.log(`Loaded ${cvChunks.length} CV chunks`);
    return cvChunks;
  } catch (error) {
    console.error('Error loading CV:', error);
    return [];
  }
}

export function findRelevantContext(query: string, topK: number = 3): string {
  const chunks = loadCV();
  const queryEmbedding = simpleEmbed(query);

  // Calculate similarity scores
  const scoredChunks = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  // Sort by score and take top K
  scoredChunks.sort((a, b) => b.score - a.score);
  const topChunks = scoredChunks.slice(0, topK);

  // Return concatenated context
  return topChunks.map(sc => sc.chunk.content).join('\n\n');
}
