# Chatly - Real-time Chat Application

A modern real-time chat application built with Next.js, Firebase, and Tailwind CSS.

![Chatly Application](https://github.com/user-attachments/assets/9f905830-27ce-4456-9566-cfa6446bd49e)

## Features

- Real-time messaging
- Google Authentication
- Online/Offline status
- Clean and responsive UI
- Message timestamps
- User-friendly interface

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Styling: Tailwind CSS and shadcn/ui
- Authentication: Firebase Authentication
- Database: Firebase Firestore
- State Management: Zustand

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd cursor-chat-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a Firebase project:

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Google provider, Email/Password)
   - Create a Firestore database
   - Get your Firebase configuration

4. Create a `.env.local` file in the root directory and add your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Set up Firestore indexes:

   a. Install Firebase CLI globally:

   ```bash
   npm install -g firebase-tools
   ```

   b. Login to Firebase:

   ```bash
   firebase login
   ```

   c. Initialize Firebase in your project:

   ```bash
   firebase init
   ```

   d. Deploy the indexes:

   ```bash
   firebase deploy --only firestore:indexes
   ```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Firebase Security Rules

Add these security rules to your Firebase Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        request.resource.data.senderId == request.auth.uid;
    }
  }
}
```

## Contributing

Feel free to open issues and pull requests!
