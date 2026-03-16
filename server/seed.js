const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
require("dotenv").config();

const dummyUsers = [
  {
    name: "Admin",
    email: "admin@engineera.com",
    password: "admin123456",
    role: "admin",
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
];

const dummyPosts = [
  {
    title: "Tesla Model S Plaid: A Speed Demon",
    content:
      "The Tesla Model S Plaid is the fastest accelerating production car in the world. With over 1,000 horsepower, it can go from 0-60 mph in less than 2 seconds. The interior is also packed with tech, including a massive horizontal screen and a yoke-style steering wheel.",
    excerpt:
      "Explore the performance and features of the world's fastest production EV.",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad42243c2d?auto=format&fit=crop&q=80&w=1000",
    brand: "Tesla",
    category: "Electric Cars",
    author: "Admin",
    isFeatured: true,
  },
  {
    title: "The Future of SUVs: 2025 Range Rover Electric",
    content:
      "Range Rover is finally going fully electric. The upcoming 2025 model promises to maintain the brand's legendary off-road capability while providing a silent, zero-emissions driving experience. Expectations are high for its range and luxury features.",
    excerpt: "Range Rover enters the EV era with its most advanced SUV yet.",
    image:
      "https://images.unsplash.com/photo-1606148664002-093521952e41?auto=format&fit=crop&q=80&w=1000",
    brand: "Land Rover",
    category: "SUVs",
    author: "Jane Doe",
  },
  {
    title: "Porsche 911 GT3 RS: Pure Racing DNA",
    content:
      "The 911 GT3 RS is a street-legal race car. Its naturally aspirated engine and extreme aerodynamics make it a track weapon. The massive rear wing and lightweight construction are designed for maximum downforce and speed through corners.",
    excerpt:
      "Porsche pushes the boundaries of performance with the latest GT3 RS.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
    brand: "Porsche",
    category: "Sports Cars",
    author: "Admin",
    isFeatured: true,
  },
  {
    title: "Rolls-Royce Spectre: Luxury Reimagined",
    content:
      "The Spectre is Rolls-Royce's first fully electric car. It combines the brand's signature \"magic carpet ride\" with electric power. The interior is a masterpiece of craftsmanship, featuring thousands of starlight LEDs in the doors and headliner.",
    excerpt:
      "Experience the ultimate in electric luxury with the Rolls-Royce Spectre.",
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=1000",
    brand: "Rolls-Royce",
    category: "Luxury Cars",
    author: "John Smith",
  },
  {
    title: "Mercedes-Benz Vision One-Eleven: A Retro-Futuristic Concept",
    content:
      "The Vision One-Eleven is a stunning concept car that pays homage to the legendary C111 experimental vehicles of the 1970s. It features gull-wing doors and an orange and silver paint scheme, combined with futuristic axial-flux electric motors.",
    excerpt:
      "Mercedes-Benz blends retro style with future tech in this concept car.",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1000",
    brand: "Mercedes-Benz",
    category: "Concept Cars",
    author: "Admin",
  },
  {
    title: "Ferrari Roma Spider: Elegant Open-Top Motoring",
    content:
      "The Ferrari Roma Spider brings open-top elegance to the Roma lineup. It features a soft-top roof that can be opened in just 13.5 seconds. Powered by a twin-turbo V8, it offers both performance and style in abundance.",
    excerpt:
      "Ferrari unveils the stunning open-top version of its Roma grand tourer.",
    image:
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1000",
    brand: "Ferrari",
    category: "Car Launches",
    author: "Jane Doe",
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("Existing data cleared.");

    // Seed Users
    const createdUsers = await User.create(dummyUsers);
    console.log(`${createdUsers.length} users created.`);

    // Seed Posts
    const createdPosts = await Post.create(dummyPosts);
    console.log(`${createdPosts.length} posts created.`);

    // Seed Comments for the first few posts
    const dummyComments = [
      {
        postId: createdPosts[0]._id,
        username: "John Smith",
        comment:
          "This car is absolutely insane! The acceleration is mind-blowing.",
      },
      {
        postId: createdPosts[0]._id,
        username: "Jane Doe",
        comment: "I wonder how the range holds up with aggressive driving.",
      },
      {
        postId: createdPosts[1]._id,
        username: "Admin",
        comment:
          "The Range Rover Electric is going to be a game-changer for luxury SUVs.",
      },
      {
        postId: createdPosts[2]._id,
        username: "John Smith",
        comment: "Best Porsche ever made. Period.",
      },
    ];

    await Comment.create(dummyComments);
    console.log(`${dummyComments.length} comments created.`);

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
