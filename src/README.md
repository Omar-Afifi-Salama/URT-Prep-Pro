# Catalyst URT Prep

Catalyst URT Prep is a web application designed to help students prepare for the University Readiness Test (URT). It uses Google's Gemini generative AI to create a limitless supply of high-quality, realistic practice passages and questions across a variety of subjects, including English, Physics, Chemistry, Biology, and Geology.

![App Screenshot](https://placehold.co/1200x600.png)

## Key Features

- **Dynamic Content Generation:** Leverages AI to generate unique, exam-level passages and multiple-choice questions on demand.
- **Customizable Practice:** Choose between a quick "Single Passage" practice or build a "Full Test" with a custom mix of subjects.
- **Realistic Formats:** Generates passages that mimic the style and complexity of real exams, including ACT-style science passages with data tables and charts.
- **Instant Grading & Feedback:** Get immediate results upon submission, complete with detailed explanations for every question in both English and Arabic.
- **Performance Dashboard:** Automatically saves all test results, allowing you to track your scores, monitor progress, and identify areas for improvement.
- **Export to PDF:** Save and print your detailed test reviews for offline study.
- **Customizable UI:** Personalize your study environment with multiple color themes and font choices.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **AI Integration:** Google AI SDK for Gemini
- **State Management:** React Context

## Getting Started

To run the project locally, follow these steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/catalyst-urt-prep.git
    cd catalyst-urt-prep
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

### Configuration (API Key)

The application requires a personal Google AI API key to generate new content. The included demo sets for Biology and Geology work without needing a key.

To get and set up your API key:

1.  Navigate to the **Billing** page within the application.
2.  Follow the instructions to create a free API key from the [Google AI Studio](https://makersuite.google.com/app/apikey).
3.  Paste your key into the input box on the Billing page and click **Save Key**.
4.  The key is stored securely in your browser's local storage and is only sent directly to Google's API during passage generation.

## Project Structure

- `src/app/`: Contains the main pages and routing for the Next.js application.
- `src/components/`: Shared React components used throughout the application (e.g., UI elements, layout).
- `src/ai/`: Holds the server-side logic for interacting with the Google AI API.
- `src/lib/`: Includes constants, type definitions, and utility functions.
- `src/context/`: React context providers for managing global state like theme and font.
