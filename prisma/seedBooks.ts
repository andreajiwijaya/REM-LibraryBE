// prisma/seedBooksBatch2.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const books = [
       {
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      description: "Novel populer tentang perjuangan anak-anak di Belitung untuk mendapatkan pendidikan.",
      categories: ["Fiction", "Education", "Travelogue"]
    },
    {
      title: "Negeri 5 Menara",
      author: "Ahmad Fuadi",
      description: "Kisah inspiratif tentang kehidupan santri dan persahabatan di pesantren.",
      categories: ["Fiction", "Religion", "Education"]
    },
    {
      title: "Ayat-Ayat Cinta",
      author: "Habiburrahman El Shirazy",
      description: "Novel romantis berlatar Islam dan budaya Timur Tengah.",
      categories: ["Religion", "Fiction", "Romance"]
    },
    {
      title: "Dilan: Dia adalah Dilanku Tahun 1990",
      author: "Pidi Baiq",
      description: "Novel remaja populer tentang kisah cinta di SMA di Bandung.",
      categories: ["Fiction", "Romance", "Youth"]
    },
    {
      title: "Supernova: Ksatria, Puteri, dan Bintang Jatuh",
      author: "Dewi Lestari",
      description: "Novel fiksi ilmiah dengan unsur spiritual dan filsafat.",
      categories: ["Fiction", "Science Fiction", "Philosophy"]
    },
    {
      title: "Garuda di Dadaku",
      author: "Bastian Tito",
      description: "Kisah inspiratif tentang sepak bola dan semangat nasionalisme.",
      categories: ["Sports", "Biography", "Youth"]
    },
    {
      title: "Cantik Itu Luka",
      author: "Eka Kurniawan",
      description: "Novel yang menggabungkan sejarah, politik, dan realisme magis di Indonesia.",
      categories: ["Fiction", "History", "Art"]
    },
    {
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      description: "Novel klasik yang menceritakan kolonialisme dan perjuangan bangsa Indonesia.",
      categories: ["Fiction", "History", "Classic Literature"]
    },
    {
      title: "Tenggelamnya Kapal Van der Wijck",
      author: "Hamka",
      description: "Novel romantis dan kritik sosial berlatar budaya Minangkabau.",
      categories: ["Fiction", "Religion", "Romance"]
    },
    {
      title: "Negeri Seni: Kisah Perjalanan dan Kreativitas",
      author: "Riri Riza",
      description: "Buku tentang seni dan budaya Indonesia.",
      categories: ["Art", "Travelogue", "Education"]
    },
    {
      title: "Comic Strip Si Juki",
      author: "Faza Meonk",
      description: "Komik strip populer yang mengkritik sosial dan budaya Indonesia dengan humor.",
      categories: ["Comics", "Humor", "Satire"]
    },
    {
      title: "Garis Waktu",
      author: "Fiersa Besari",
      description: "Novel yang menggabungkan musik, cinta, dan perjalanan hidup.",
      categories: ["Fiction", "Music", "Romance"]
    },
    {
      title: "Jalan Raya Pos: Sejarah dan Perjalanan",
      author: "M. Nasir",
      description: "Buku perjalanan dan sejarah jalan utama di Indonesia.",
      categories: ["Travelogue", "History", "Educational"]
    },
    {
      title: "Cerita Rakyat Nusantara",
      author: "Various",
      description: "Kumpulan cerita rakyat dan legenda dari berbagai daerah di Indonesia.",
      categories: ["Anthology", "Folklore", "Education"]
    },
    {
      title: "Mengenal Hukum di Indonesia",
      author: "Andi Hamzah",
      description: "Buku pengantar hukum dan sistem peradilan Indonesia.",
      categories: ["Law", "Educational"]
    },
    {
      title: "Tanaman Obat Keluarga",
      author: "Dewi Rachmat",
      description: "Panduan praktis menanam dan menggunakan tanaman obat di rumah.",
      categories: ["Gardening", "Health", "Educational"]
    },
    {
      title: "Parenting ala Rasulullah",
      author: "Aidh al-Qarni",
      description: "Buku parenting berdasarkan teladan Nabi Muhammad SAW.",
      categories: ["Parenting", "Religion", "Self-Help"]
    },
    {
      title: "Kisah Para Nabi",
      author: "Ibnu Katsir",
      description: "Kumpulan cerita para nabi dalam Islam.",
      categories: ["Religion", "Anthology", "Educational"]
    },
    {
      title: "Rock in Solo",
      author: "Budi Santoso",
      description: "Sejarah musik rock di Indonesia dengan fokus pada kota Solo.",
      categories: ["Music", "History"]
    },
    {
      title: "Komik Gundala",
      author: "Harya Suraminata",
      description: "Komik pahlawan super asli Indonesia.",
      categories: ["Comics", "Action", "Graphic Novels"]
    },
    {
      title: "Perjalanan Sang Pemimpi",
      author: "Andrea Hirata",
      description: "Novel tentang mimpi dan perjuangan seorang anak desa di Indonesia.",
      categories: ["Fiction", "Youth", "Motivation"]
    },
    {
      title: "Mengenal Flora Indonesia",
      author: "Sari Dewi",
      description: "Panduan mengenal dan merawat tumbuhan asli Indonesia.",
      categories: ["Gardening", "Education", "Nature"]
    },
    {
      title: "Panduan Hukum Bisnis di Indonesia",
      author: "Rachmat Hidayat",
      description: "Buku referensi hukum untuk pebisnis dan startup di Indonesia.",
      categories: ["Law", "Business", "Educational"]
    },
    {
      title: "Buku Pintar Cyber Security",
      author: "Dewi Kartika",
      description: "Panduan dasar keamanan siber untuk pengguna umum.",
      categories: ["Cyberpunk", "Educational", "Technology"]
    },
    {
      title: "Cerita dari Timur",
      author: "Rendra Kusuma",
      description: "Kumpulan cerita dan legenda dari wilayah timur Indonesia.",
      categories: ["Anthology", "Folklore", "Travelogue"]
    },
  ];

  for (const book of books) {
    const createdBook = await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        description: book.description,
      },
    });

    for (const categoryName of book.categories) {
      const category = await prisma.category.findFirst({
        where: { name: categoryName }
      });

      if (category) {
        await prisma.bookCategory.create({
          data: {
            bookId: createdBook.id,
            categoryId: category.id,
          },
        });
      }
    }
  }

  console.log('✅ Seed batch 8 completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
