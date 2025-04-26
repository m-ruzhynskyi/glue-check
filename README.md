
# Jysk Image Gallery

A web application for managing images in Jysk style. This application allows users to:

- Upload images with names
- View all uploaded images in a gallery
- Edit image names and replace images
- Delete images

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- PostgreSQL (Neon)
- TailwindCSS

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- PostgreSQL database (the app is configured to use Neon PostgreSQL)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your PostgreSQL connection string:
   ```
   DATABASE_URL='your-postgresql-connection-string'
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

### Image Upload

- Upload images from your device
- Provide a name for each image
- See a preview before uploading

### Image Management

- View all uploaded images in a responsive grid layout
- Edit image names
- Replace images with new ones
- Delete images with confirmation

### Database

The application uses PostgreSQL to store:
- Image metadata (name, creation date, etc.)
- Binary image data

## API Endpoints

- `GET /api/init` - Initialize the database
- `GET /api/images` - Get all images (metadata only)
- `POST /api/images` - Upload a new image
- `GET /api/images/[id]` - Get a specific image's metadata
- `PUT /api/images/[id]` - Update an image
- `DELETE /api/images/[id]` - Delete an image
- `GET /api/images/[id]/data` - Get the binary image data

## Styling

The application uses a blue color scheme inspired by Jysk's branding, with a clean and modern interface.
