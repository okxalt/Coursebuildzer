# AI Course Creator Web App

A full-stack web application that allows users to generate complete courses or ebooks from a single-line idea using AI.

## Features

- **Idea Discovery**: Transform a simple idea into multiple course opportunities
- **Course Outline Generation**: Create structured outlines with customizable chapter counts
- **Chapter Content Generation**: Generate full markdown-formatted chapter content
- **Multi-step Interface**: Clean, intuitive workflow for course creation
- **Real-time Progress**: Visual progress indicators and loading states

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS
- **AI Generation**: Groq API (for fast content generation)
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)

3. Update `.env.local` with your API key:
   ```
   GROQ_API_KEY=your-actual-groq-api-key-here
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## API Endpoints

### `/api/discover`
- **Method**: POST
- **Input**: `{ "topic": "your course idea" }`
- **Output**: Array of course opportunity titles

### `/api/outline`
- **Method**: POST
- **Input**: `{ "opportunityTitle": "Course Title", "numChapters": 7 }`
- **Output**: Structured course outline with chapters and learning objectives

### `/api/generate`
- **Method**: POST
- **Input**: `{ "courseTitle": "Course Title", "chapterTitle": "Chapter Title", "learningObjectives": ["objective1", "objective2"] }`
- **Output**: Generated markdown content for the chapter

## Deployment to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your `GROQ_API_KEY` environment variable in Vercel's dashboard
4. Deploy!

The application is fully configured for Vercel deployment with all necessary settings.

## Usage

1. **Enter Your Idea**: Start with a simple topic or idea
2. **Choose Opportunity**: Select from AI-generated course opportunities
3. **Configure Course**: Set the number of chapters you want
4. **Generate Content**: Create full chapter content one by one
5. **Export/Use**: Copy the generated markdown content for your course

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── discover/route.js    # Opportunity discovery endpoint
│   │   ├── outline/route.js     # Course outline generation
│   │   └── generate/route.js    # Chapter content generation
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── page.js                  # Main application component
├── .env.example                 # Environment variables template
├── .env.local                   # Local environment variables
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.