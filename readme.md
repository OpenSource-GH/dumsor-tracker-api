## Dumsor Tracker Backend

### Overview
The Dumsor Tracker project aims to monitor and analyze power outage patterns across the country.

### Backend Stack
- Node.js with Express
- MongoDB (Primary DB)
- Supabase (BaaS) - for auth.

### Features
- Track power outages and durations.
- View historical data of power outages.
- Manage user schedules and notifications.

# Setting Up

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance set up and running.
- Supabase project created.

1. Clone the repository:
`git clone https://github.com/OpenSource-GH/dumsor-tracker-api.git`

2. Navigate to the project directory:
   
`cd dumsor-tracker-api`

4. Install Dependencies
   
  `npm install`

# Configuration
1. ### MongoDB Connection:

Create a .env file in the project root directory. Add the following environment variable, replacing `<your_mongo_url>` with your actual MongoDB connection URL:
  `MONGODB_URL=<your_mongo_url>`

2. ### Supabase Configuration:

Fetch your Supabase project's URL and Anon key from the Supabase dashboard. Set the following environment variables in your .env file:

  `SUPABASE_URL=<your_supabase_url>`

  `SUPABASE_ANON_KEY=<your_supabase_anon_key>`

 3. ### Run the Server

   `npm start`


### Application Workflow
- Authentication: The application will require authentication. Users can view data without creating an account, but will have to create one to post data.

- Reporting Power Outages: Users can report power outages by visiting the application and providing the following details:
  - Location
  - Power Status: Whether the user has electricity or not.

This streamlined approach will allow for easy data submission and help in tracking and analyzing power outage trends effectively.







## Contributing
Contributions are welcome! Please read our [Contribution Guidelines](contributing/CONTRIBUTING.md) before contributing to the project.

