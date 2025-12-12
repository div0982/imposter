// Word Database - 15 categories with 20 words each (300 total)

const wordDatabase = {
    "Animals": {
        emoji: "🐾",
        words: [
            "Lion", "Elephant", "Penguin", "Dolphin", "Tiger",
            "Giraffe", "Kangaroo", "Panda", "Eagle", "Shark",
            "Octopus", "Butterfly", "Gorilla", "Koala", "Zebra",
            "Flamingo", "Owl", "Whale", "Cheetah", "Bear"
        ]
    },
    "Brands & Logos": {
        emoji: "🏢",
        words: [
            "Nike", "Apple", "McDonald's", "Coca-Cola", "Amazon",
            "Google", "Starbucks", "Disney", "Netflix", "Samsung",
            "Adidas", "BMW", "Ferrari", "PlayStation", "Xbox",
            "Pepsi", "KFC", "Subway", "Intel", "Microsoft"
        ]
    },
    "Colors & Shapes": {
        emoji: "🎨",
        words: [
            "Red", "Blue", "Yellow", "Green", "Purple",
            "Circle", "Square", "Triangle", "Rectangle", "Star",
            "Heart", "Diamond", "Orange", "Pink", "Black",
            "White", "Gray", "Pentagon", "Hexagon", "Oval"
        ]
    },
    "Countries & Cities": {
        emoji: "🌍",
        words: [
            "France", "Japan", "Canada", "Australia", "Brazil",
            "Germany", "Italy", "Spain", "Egypt", "China",
            "Paris", "London", "Tokyo", "New York", "Dubai",
            "Rome", "Sydney", "Moscow", "Mexico", "India"
        ]
    },
    "Emotions & Feelings": {
        emoji: "😊",
        words: [
            "Happy", "Sad", "Angry", "Excited", "Nervous",
            "Surprised", "Scared", "Confused", "Relaxed", "Bored",
            "Proud", "Jealous", "Grateful", "Lonely", "Confident",
            "Worried", "Disgusted", "Embarrassed", "Curious", "Love"
        ]
    },
    "Hobbies & Activities": {
        emoji: "🎸",
        words: [
            "Reading", "Painting", "Dancing", "Singing", "Cooking",
            "Gaming", "Photography", "Gardening", "Fishing", "Hiking",
            "Cycling", "Swimming", "Knitting", "Writing", "Drawing",
            "Skateboarding", "Camping", "Traveling", "Yoga", "Running"
        ]
    },
    "Internet Culture": {
        emoji: "💻",
        words: [
            "Meme", "Viral", "Tweet", "Hashtag", "Emoji",
            "Screenshot", "GIF", "Stream", "Subscribe", "Like",
            "Comment", "Share", "Trending", "Influencer", "Podcast",
            "TikTok", "YouTube", "Instagram", "Reddit", "Discord"
        ]
    },
    "Kitchen & Cooking": {
        emoji: "🍳",
        words: [
            "Oven", "Refrigerator", "Knife", "Spoon", "Fork",
            "Pot", "Pan", "Blender", "Microwave", "Toaster",
            "Cutting Board", "Mixer", "Spatula", "Whisk", "Grater",
            "Colander", "Measuring Cup", "Peeler", "Ladle", "Tongs"
        ]
    },
    "Sports": {
        emoji: "⚽",
        words: [
            "Soccer", "Basketball", "Tennis", "Baseball", "Football",
            "Hockey", "Golf", "Swimming", "Boxing", "Volleyball",
            "Cricket", "Rugby", "Skiing", "Surfing", "Skateboarding",
            "Gymnastics", "Wrestling", "Badminton", "Bowling", "Archery"
        ]
    },
    "Superheroes": {
        emoji: "🦸",
        words: [
            "Superman", "Batman", "Spider-Man", "Iron Man", "Wonder Woman",
            "Hulk", "Thor", "Captain America", "Black Widow", "Flash",
            "Aquaman", "Black Panther", "Deadpool", "Wolverine", "Ant-Man",
            "Doctor Strange", "Scarlet Witch", "Vision", "Hawkeye", "Thanos"
        ]
    },
    "Video Games": {
        emoji: "🎮",
        words: [
            "Mario", "Minecraft", "Fortnite", "Pokémon", "Zelda",
            "Call of Duty", "FIFA", "GTA", "Roblox", "Among Us",
            "Pac-Man", "Tetris", "Sonic", "Street Fighter", "Overwatch",
            "League of Legends", "Valorant", "Apex Legends", "Halo", "Doom"
        ]
    },
    "Occupations": {
        emoji: "👔",
        words: [
            "Doctor", "Teacher", "Engineer", "Lawyer", "Chef",
            "Nurse", "Police Officer", "Firefighter", "Pilot", "Artist",
            "Musician", "Scientist", "Farmer", "Plumber", "Electrician",
            "Dentist", "Veterinarian", "Accountant", "Architect", "Mechanic"
        ]
    },
    "Famous Things": {
        emoji: "🌟",
        words: [
            "Eiffel Tower", "Statue of Liberty", "Great Wall", "Pyramids", "Taj Mahal",
            "Big Ben", "Hollywood Sign", "Mount Everest", "Niagara Falls", "Colosseum",
            "Mona Lisa", "Golden Gate Bridge", "Stonehenge", "Leaning Tower", "Times Square",
            "Grand Canyon", "Sphinx", "Easter Island", "Northern Lights", "Amazon River"
        ]
    },
    "Food & Drinks": {
        emoji: "🍕",
        words: [
            "Pizza", "Burger", "Pasta", "Sushi", "Tacos",
            "Ice Cream", "Chocolate", "Coffee", "Tea", "Sandwich",
            "Salad", "Steak", "Chicken", "Rice", "Noodles",
            "Cake", "Cookies", "Donut", "Pancakes", "Waffles"
        ]
    },
    "Everyday Objects": {
        emoji: "📦",
        words: [
            "Phone", "Laptop", "Chair", "Table", "Lamp",
            "Book", "Pen", "Keys", "Wallet", "Watch",
            "Glasses", "Backpack", "Umbrella", "Mirror", "Clock",
            "Pillow", "Blanket", "Towel", "Soap", "Toothbrush"
        ]
    }
};

// Helper function to get random word from selected categories
function getRandomWord(selectedCategories) {
    if (selectedCategories.length === 0) return null;
    
    const randomCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];
    const categoryWords = wordDatabase[randomCategory].words;
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
    return {
        word: randomWord,
        category: randomCategory
    };
}

// Helper function to get category hint
function getCategoryHint(category) {
    const hints = {
        "Animals": "It's an animal",
        "Brands & Logos": "It's a brand",
        "Colors & Shapes": "It's a color or shape",
        "Countries & Cities": "It's a place",
        "Emotions & Feelings": "It's a feeling",
        "Hobbies & Activities": "It's an activity",
        "Internet Culture": "It's from the internet",
        "Kitchen & Cooking": "It's kitchen-related",
        "Sports": "It's a sport",
        "Superheroes": "It's a superhero",
        "Video Games": "It's a video game",
        "Occupations": "It's a job",
        "Famous Things": "It's famous",
        "Food & Drinks": "It's food or drink",
        "Everyday Objects": "It's an everyday object"
    };
    
    return hints[category] || "Think carefully...";
}
