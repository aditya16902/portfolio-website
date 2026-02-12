import { cvData, findChunksByKeywords, type CVChunk } from '@/data/cv-data';

/**
 * RAG (Retrieval-Augmented Generation) System
 * Uses keyword-based retrieval with semantic chunking
 */

// Log chunk loading
console.log(`📚 Loaded ${cvData.length} semantically chunked CV sections`);

/**
 * Find relevant context for a given query
 * Uses keyword matching with scoring algorithm
 * 
 * @param query - User's question
 * @param topK - Number of chunks to return (default: 3)
 * @returns Concatenated context from top matching chunks
 */
export function findRelevantContext(query: string, topK: number = 3): string {
  console.log(`🔍 RAG: Searching for context, query: "${query}"`);
  
  // Use keyword-based retrieval
  const relevantChunks = findChunksByKeywords(query, topK);
  
  if (relevantChunks.length === 0) {
    console.log('⚠️ RAG: No relevant chunks found, using summary');
    // Fallback to summary if no matches
    const summaryChunk = cvData.find(c => c.id === 'summary');
    return summaryChunk ? summaryChunk.content : '';
  }
  
  console.log(`✅ RAG: Found ${relevantChunks.length} relevant chunks:`, 
    relevantChunks.map(c => c.section)
  );
  
  // Concatenate content from relevant chunks
  return relevantChunks.map(chunk => chunk.content).join('\n\n');
}

/**
 * Get all available CV chunks
 * @returns Array of all CV chunks
 */
export function getAllChunks(): CVChunk[] {
  return cvData;
}

/**
 * Get chunk by ID
 * @param id - Chunk identifier
 * @returns CVChunk or undefined
 */
export function getChunkById(id: string): CVChunk | undefined {
  return cvData.find(chunk => chunk.id === id);
}
