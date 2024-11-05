// src/app/types.ts

export interface Character {
    id: number;
    name: string;
    description: string;
    thumbnail: {
      path: string;
      extension: string;
    };
  }
  
  export interface Comic {
    id: number;
    title: string;
    description: string;
    pageCount: number;
    dates: Array<{ type: string; date: string }>;
    thumbnail: {
      path: string;
      extension: string;
    };
  }
  