import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    { name: 'Fiction', description: 'Literary works invented by the imagination' },
    { name: 'Non-Fiction', description: 'Books based on facts and real events' },
    { name: 'Science', description: 'Books about scientific knowledge and discoveries' },
    { name: 'History', description: 'Books about historical events and periods' },
    { name: 'Biography', description: 'Life stories of real people' },
    { name: 'Philosophy', description: 'Exploration of philosophical ideas and thinkers' },
    { name: 'Fantasy', description: 'Books with magical or supernatural elements' },
    { name: 'Mystery', description: 'Books involving suspense and solving crimes' },
    { name: 'Romance', description: 'Books focused on love and relationships' },
    { name: 'Thriller', description: 'Exciting, suspenseful books with high stakes' },
    { name: 'Self-Help', description: 'Books aimed at personal development and improvement' },
    { name: 'Poetry', description: 'Books composed of poems and poetic works' },
    { name: 'Drama', description: 'Serious literary works often focused on emotional themes' },
    { name: 'Travel', description: 'Books about journeys and exploration of places' },
    { name: 'Religion', description: 'Books on spiritual beliefs and religious teachings' },
    { name: 'Children', description: 'Books written for children and young readers' },
    { name: 'Young Adult', description: 'Books aimed at teenage readers' },
    { name: 'Science Fiction', description: 'Fiction based on futuristic or scientific concepts' },
    { name: 'Art', description: 'Books about visual arts, artists, and art history' },
    { name: 'Cooking', description: 'Books with recipes and culinary techniques' },
    { name: 'Health', description: 'Books about wellness, fitness, and medical knowledge' },
    { name: 'Politics', description: 'Books on political theories, events, and figures' },
    { name: 'Economics', description: 'Books about economic theory and practice' },
    { name: 'Education', description: 'Books focused on teaching and learning methods' },
    { name: 'Psychology', description: 'Books about human mind and behavior' },
    { name: 'Technology', description: 'Books on technological advancements and IT' },
    { name: 'Business', description: 'Books about entrepreneurship and management' },
    { name: 'Classic Literature', description: 'Timeless literary works from past centuries' },
    { name: 'Memoir', description: 'Personal accounts of life experiences' },
    { name: 'Adventure', description: 'Books about exciting and risky journeys' },
    { name: 'Graphic Novels', description: 'Books using sequential art storytelling' },
    { name: 'Horror', description: 'Books designed to frighten and thrill' },
    { name: 'Religion & Spirituality', description: 'Books on spiritual teachings and practices' },
    { name: 'Sports', description: 'Books about sports and athleticism' },
    { name: 'Music', description: 'Books about music, musicians, and theory' },
    { name: 'Law', description: 'Books on legal systems and studies' },
    { name: 'Gardening', description: 'Books about plants, gardening techniques' },
    { name: 'Environment', description: 'Books on ecological and environmental topics' },
    { name: 'Parenting', description: 'Books about raising children and family life' },
    { name: 'Comics', description: 'Books containing comic strips or series' },
    { name: 'Satire', description: 'Books using humor, irony, or exaggeration' },
    { name: 'True Crime', description: 'Books about real criminal cases' },
    { name: 'Anthology', description: 'Collections of works by various authors' },
    { name: 'Classic', description: 'Books widely recognized as important literary works' },
    { name: 'Travelogue', description: 'Books about travel experiences and reports' },
    { name: 'Reference', description: 'Books intended for quick fact consultation' },
    { name: 'Anthropology', description: 'Books on human societies and cultures' },
    { name: 'Sociology', description: 'Books about social behavior and societies' },
    { name: 'Dystopian', description: 'Books depicting oppressive futuristic societies' },
    { name: 'Cyberpunk', description: 'Science fiction subgenre with futuristic tech and dystopia' },
    { name: 'Epic', description: 'Long narrative works often with heroic themes' },
    { name: 'Western', description: 'Books about the American Old West' },
    { name: 'Mythology', description: 'Books on myths, legends, and folklore' },
    { name: 'Classic Romance', description: 'Romantic literature from classic authors' },
    { name: 'Educational', description: 'Books intended for teaching academic subjects' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Categories seeded successfully!');
}

async function main() {
  await seedCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
