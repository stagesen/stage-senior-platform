import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string): string {
  const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of', 'with'];
  
  return str
    .split(' ')
    .map((word, index) => {
      // Preserve all-caps words (acronyms like AL, MC, IL)
      if (word === word.toUpperCase() && word.length > 1 && /[A-Z]/.test(word)) {
        return word;
      }
      
      // Preserve already properly capitalized words
      if (word.charAt(0) === word.charAt(0).toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
        return word;
      }
      
      // Handle hyphenated words (e.g., "arvada-stonebridge" → "Arvada-Stonebridge")
      if (word.includes('-')) {
        return word.split('-').map(part => {
          if (part === part.toUpperCase() && part.length > 1 && /[A-Z]/.test(part)) {
            return part; // Preserve acronyms in hyphenated words
          }
          const lowerPart = part.toLowerCase();
          return lowerPart.charAt(0).toUpperCase() + lowerPart.slice(1);
        }).join('-');
      }
      
      // Convert to lowercase for processing
      const lowerWord = word.toLowerCase();
      
      // Title case: capitalize first word or non-minor words
      if (index === 0 || !minorWords.includes(lowerWord)) {
        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      }
      
      return lowerWord;
    })
    .join(' ');
}
