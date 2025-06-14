import { Publication } from '@/src/types/publication'; // Importe a interface Publication

let mockPublications: Publication[] = [
  {
    id: "global-mock-1",
    title: "Understanding Gamification Basics",
    author: "System Admin",
    tags: ["gamification", "basics"],
    createdAt: new Date(new Date().setHours(new Date().getHours() - 5)),
    updatedAt: new Date(new Date().setHours(new Date().getHours() - 5)),
    slug: "understanding-gamification-basics",
    summary: "A foundational guide to gamification principles and their application in various industries.",
    content: "<h1>Gamification Fundamentals</h1><p>Gamification involves applying game-design elements and game principles in non-game contexts. It typically involves applying game-design thinking to make systems, services, and activities more fun and engaging. It can be used to improve user engagement, return on investment, data quality, timeliness, and learning.</p><img src='https://picsum.photos/200/200' alt='Gamification' style='max-width:100%; height:auto;'><p>Key elements often include:</p><ul><li>Points, Badges, Leaderboards (PBL)</li><li>Challenges and Quests</li><li>Narrative and Storytelling</li></ul>",
    imageUrl: "https://picsum.photos/200/200"
  },
  {
    id: "global-mock-2",
    title: "Technical Writing for Beginners",
    author: "Content Team",
    tags: ["technical", "writing", "documentation"],
    createdAt: new Date(new Date().setHours(new Date().getHours() - 10)),
    updatedAt: new Date(new Date().setHours(new Date().getHours() - 10)),
    slug: "technical-writing-beginners",
    summary: "A step-by-step guide for new technical writers, covering clarity, conciseness, and accuracy.",
    content: "<h1>Technical Writing</h1><p>Effective technical writing ensures information is conveyed clearly and efficiently. Focus on your audience, purpose, and clarity.</p><img src='https://picsum.photos/200/200' alt='Technical Writing' style='max-width:100%; height:auto;'><p>Always proofread and get feedback!</p>",
    imageUrl: "https://picsum.photos/200/200"
  },
];

export const addPublication = async (
  publicationData: Omit<Publication, "id" | "createdAt" | "updatedAt" | "slug">
): Promise<Publication> => {
  console.log('[ArticleService] Adding new publication (simulated):', publicationData.title);
  await new Promise(r => setTimeout(r, 500));

  const newPublication: Publication = {
    ...publicationData,
    id: `mock-${mockPublications.length + 1}-${Math.random().toString(36).substring(7)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: publicationData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
  };
  mockPublications.push(newPublication);
  console.log('[ArticleService] Publication added:', newPublication.id);
  return newPublication;
};


export const getPublications = async (): Promise<Publication[]> => {
  console.log('[ArticleService] Fetching all publications (simulated)...');
  await new Promise(r => setTimeout(r, 700));
  return [...mockPublications];
};


export const getPublicationById = async (id: string): Promise<Publication | null> => {
  console.log(`[ArticleService] Fetching publication by ID: ${id} (simulated)...`);
  await new Promise(r => setTimeout(r, 300));
  return mockPublications.find(p => p.id === id) || null;
};
