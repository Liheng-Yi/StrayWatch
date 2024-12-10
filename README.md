# StrayWatch

A platform for reuniting lost pets with their owners. Users can upload and geotag photos or videos of stray animals, allowing pet owners to search and locate their missing pets.

Tech stacks: React, Typescript, Tailwind, Node.js, Express, MongoDB, AWS S3 

## Environment Setup

Create a `.env` file in the root/client directory with the following content:

```env
# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
SERVER_PORT=5000
```
.env for back-end:
```
MONGODB_URI=mongodb_CONNECTION_STRING
PORT=5000
AWS_ACCESS_KEY=KEY
AWS_SECRET_KEY=SECRET
AWS_REGION=us-east-1
AWS_BUCKET_NAME=BUCKET_NAME
```


## To run

Split the terminal and go to ./client and ./server run "npm run dev" individually
## System design
<img width="1025" alt="469aacafde6d6e2dbed70fefadb4234" src="https://github.com/user-attachments/assets/7f6edd46-746d-4ca7-b9c8-5858b86d9283">
