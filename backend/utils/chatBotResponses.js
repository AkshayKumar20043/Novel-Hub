const chatbotResponses = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        response: "👋 Hello! Welcome to Novel Hub. I'm NovBot, your personal assistant. I can help you with:\n• Reading and discovering novels\n• Writing and publishing your work\n• Account management\n• Community features\n\nWhat would you like to know about?"
    },
    {
        keywords: ['login', 'signin', 'log in', 'sign in'],
        response: "To log in to Novel Hub:\n• Click the 'Login' button in the top right corner\n• Enter your email and password\n• Or use Google Sign-In for quick access\n\nForgot your password?\n• Click 'Forgot Password' on the login page\n• Enter your email to receive a reset link\n• Follow the link to create a new password"
    },
    {
        keywords: ['signup', 'register', 'sign up', 'create account'],
        response: "Create your Novel Hub account:\n• Click 'Sign Up' in the top right corner\n• Fill in your details:\n  - Username\n  - Email\n  - Password (min. 8 characters)\n• Verify your email address\n• Complete your profile\n\nTip: Use Google Sign-Up for faster registration!"
    },
    {
        keywords: ['logout', 'signout', 'log out', 'sign out'],
        response: "To sign out of Novel Hub:\n• Click your profile picture in the top right\n• Select 'Sign Out' from the dropdown menu\n\nSecurity Tip: Always sign out when using shared devices!"
    },
    {
        keywords: ['author', 'become author', 'write novel', 'publish'],
        response: "Want to become an author? Here's how:\n\n1. Apply for Authorship:\n• Go to your Profile Settings\n• Click 'Apply for Authorship'\n• Fill out the application form:\n  - Writing experience\n  - Sample work\n  - Genre preferences\n\n2. After Approval:\n• Access your Author Dashboard\n• Create new novels\n• Manage chapters\n• Track reader engagement\n\nNote: Applications are typically reviewed within 48 hours."
    },
    {
        keywords: ['update chapter', 'upload chapter', 'post chapter', 'new chapter'],
        response: "Managing chapters as an author:\n\n1. Upload New Chapter:\n• Go to your Author Dashboard\n• Select the novel\n• Click 'Add New Chapter'\n• Fill in:\n  - Chapter title\n  - Content\n  - Author's notes (optional)\n\n2. Chapter Settings:\n• Set visibility (Public/Private)\n• Schedule publication\n• Add content warnings\n\n3. Edit Existing Chapters:\n• Access chapter list\n• Click 'Edit' on any chapter\n• Make changes and save"
    },
    {
        keywords: ['read chapter', 'view chapter', 'read novel', 'read story'],
        response: "Reading novels on Novel Hub:\n\n1. Browse Categories:\n• Trending novels\n• New releases\n• Completed stories\n• Genre collections\n\n2. Advanced Search:\n• Use the search bar at the top\n• Filter by title, author, genre, or tags\n\n3. Novel Pages:\n• Find novel descriptions, reviews, and chapters\n• Bookmark novels for easy access"
    },
    {
        keywords: ['create novel', 'new novel', 'start novel'],
        response: "Creating a new novel:\n\n1. Initial Setup:\n• Go to Author Dashboard\n• Click 'Create New Novel'\n• Add basic info:\n  - Title\n  - Synopsis\n  - Cover image\n  - Genre tags\n\n2. Novel Settings:\n• Age rating\n• Language\n• Update schedule\n• Chapter pricing (if premium)\n\n3. Publishing Options:\n• Draft: Only visible to you\n• Public: Available to all readers\n• Scheduled: Set future publish date"
    },
    {
        keywords: ['read', 'reading', 'find novels', 'discover', 'novels'],
        response: "Discover novels on Novel Hub:\n\n1. Browse Categories:\n• Trending novels\n• New releases\n• Completed stories\n• Genre collections\n\n2. Advanced Search:\n• Use filters for:\n  - Genre\n  - Length\n  - Status\n  - Rating\n\n3. Reading Features:\n• Bookmark favorites\n• Track reading progress\n• Set reading preferences\n• Get recommendations"
    },
    {
        keywords: ['profile', 'settings', 'account settings'],
        response: "Manage your Novel Hub profile:\n\n1. Profile Settings:\n• Update personal info\n• Change profile picture\n• Customize bio\n• Set privacy preferences\n\n2. Reading Preferences:\n• Font size and style\n• Dark/Light mode\n• Language settings\n• Content filters\n\n3. Notification Settings:\n• Chapter updates\n• Comments and replies\n• Author announcements\n• System notifications"
    },
    {
        keywords: ['review', 'rate', 'feedback'],
        response: "Reviewing novels on Novel Hub:\n\n1. Write a Review:\n• Go to novel page\n• Click 'Write Review'\n• Rate (1-5 stars)\n• Share your thoughts\n• Add specific feedback:\n  - Plot\n  - Characters\n  - Writing style\n\n2. Review Guidelines:\n• Be constructive\n• No spoilers without tags\n• Follow community guidelines\n\n3. Manage Reviews:\n• Edit your reviews\n• Reply to comments\n• Report inappropriate content"
    },
    {
        keywords: ['premium', 'subscription', 'membership'],
        response: "Novel Hub Premium Features:\n\n1. Reader Benefits:\n• Early access to chapters\n• Ad-free reading\n• Advanced reading features:\n  - Text-to-speech\n  - Offline reading\n  - Custom themes\n\n2. Author Benefits:\n• Analytics dashboard\n• Marketing tools\n• Premium chapter monetization\n• Priority support\n\n3. Subscription Options:\n• Monthly plan\n• Annual plan (save 20%)\n• Premium+ tier"
    },
    {
        keywords: ['help', 'support', 'contact', 'issue'],
        response: "Need help? We're here for you!\n\n1. Support Options:\n• Email: support@novelHub.com\n• Live chat (Premium users)\n• Help Center\n• Community forum\n\n2. Common Solutions:\n• Check FAQs\n• Search knowledge base\n• View video tutorials\n\n3. Report Issues:\n• Technical problems\n• Content concerns\n• Account issues\n• Payment problems"
    }
];

module.exports = chatbotResponses;
