
# Jysk Image Gallery

A web application for managing images with three different user interfaces.

## Features

### 1. Admin Interface (Hidden)
- Access by double-clicking the "Jysk Image Gallery" title in the header
- Add, edit, and delete images
- Full management capabilities
- Upload images from your device
- Provide a name for each image
- See a preview before uploading

### 2. Consultant Interface
- Default interface when opening the application
- View all available images
- Enter length measurements in meters for images
- Submit measurements for cashiers to view

### 3. Cashier Interface
- View images that consultants have submitted with length measurements
- See when each submission was created and when it will expire
- Submissions automatically expire after 1 hour

## Interface Switching

- Use the toggle buttons in the top-right corner to switch between Consultant and Cashier interfaces
- The Admin interface is accessed by double-clicking the application title (hidden feature)

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- PostgreSQL
- TailwindCSS

## Technical Details

### Database Structure
- Images table: Stores image metadata and binary data
- User roles table: Defines the three roles (admin, consultant, cashier)
- Consultant submissions table: Tracks image selections with length measurements

### Data Cleanup
- Consultant submissions are automatically cleared after 1 hour
- A cleanup process runs periodically to remove expired submissions

### API Endpoints

- `GET /api/init` - Initialize the database
- `GET /api/images` - Get all images (metadata only)
- `POST /api/images` - Upload a new image
- `GET /api/images/[id]` - Get a specific image's metadata
- `PUT /api/images/[id]` - Update an image
- `DELETE /api/images/[id]` - Delete an image
- `GET /api/images/[id]/data` - Get the binary image data
- `GET /api/submissions` - Get all active consultant submissions
- `POST /api/submissions` - Create a new consultant submission
- `DELETE /api/submissions` - Clean up expired submissions

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your PostgreSQL connection string:
   ```
   DATABASE_URL='your-postgresql-connection-string'
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Styling

The application uses a blue color scheme inspired by Jysk's branding, with a clean and modern interface.
