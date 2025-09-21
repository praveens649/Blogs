# Blogspace - Modern Blogging Platform

A modern, feature-rich blogging platform built with Next.js 14, React, and Supabase. Create, share, and engage with blog posts in a beautiful, responsive environment.

## Features

- 🔐 Secure Authentication with Supabase
- 📝 Create, Edit, and Delete Blog Posts
- 🖼️ Image Upload Support
- 💡 Rich Text Editing
- 🎨 Modern UI with Tailwind CSS
- ⚡ Real-time Updates
- 📱 Fully Responsive Design

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** Supabase Auth
- **Database:** Supabase
- **Styling:** Tailwind CSS
- **State Management:** React Query
- **UI Components:** shadcn/ui
- **Image Storage:** Supabase Storage
- **Deployment:** Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blogspace.git
cd blogspace
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
blogspace/
├── app/
│   ├── components/       # Reusable components
│   ├── backend/         # Backend services
│   ├── blog/           # Blog pages
│   └── ...
├── public/             # Static assets
└── ...
```

## Key Features Explained

### Authentication
- Secure email/password authentication
- Protected routes
- Persistent sessions

### Blog Management
- Create new blog posts with rich text editor
- Upload and manage featured images
- Edit existing posts
- Delete posts
- View all posts in a responsive grid

### User Experience
- Responsive design for all devices
- Loading states and error handling
- Toast notifications for user feedback
- Smooth transitions and animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/blogspace](https://github.com/yourusername/blogspace)