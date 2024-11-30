# HappyTails 
Welcome to HappyTails, a platform dedicated to connecting pets in need of a loving home with potential adopters. Our mission is to make pet adoption easy, transparent, and accessible to everyone.
## Table of Contents
1. [About the Project](#about-the-project)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)   
4. [Usage](#usage)  
6. [Acknowledgments](#acknowledgments)  
---
## About the Project
**HappyTails** is a web-based application designed to bridge the gap between animal shelters and individuals seeking pets. The platform allows users to browse available pets, filter based on preferences, and securely initiate the adoption process. Shelters can manage pet profiles, track adoptions, and communicate with adopters.

---
## Features

- 🐶 **Pet Profiles**: Detailed profiles with pictures, descriptions.  
- 🐱 **Search & Filters**: Easily search and filter pets by type, description, and gender.  
- 🐾 **User Authentication**: Secure login/signup with Google OAuth 2.0 and email OTP verification.  
- 🏡 **Adoption Requests**: Users can request adoptions and track their status.  
- 🛠️ **Admin Dashboard**: Manage pets, monitor requests, and oversee the adoption process.  
- 🔒 **Secure Cookies**: Authorization using cookies for better session management.  
- 💌 **Email Notifications**: OTP verification and updates via email.  

---
## Technologies Used

- **Frontend**: React, Redux, Axios, Vite  
- **Backend**: Node.js, Express, MongoDB, Firebase  
- **Authentication**: Google OAuth 2.0, OTP via Gmail  
- **Hosting**: Render (Frontend and Backend)  
- **Testing**: Mocha, Chai, Jmeter, Selenium, Stryker
  - Mocha, Chai for Unit testing
  - Jmeter for Non functional testing
  - Selenium IDE for GUI testing
  - Stryker for mutation testing
- **Documentation**: Draw.io 
  - User stories, functional and non functional requirements
  - State and Activity diagrams
  - Class diagrams
  - Sequence diagrams

---
## Usage 
- The site has already been deployed on render and can be accessed using the following link : [HappyTails](https://happytails-zi2r.onrender.com)
- If you want to run the site on localhost download the code from this link : [HappyTails_LocalHost](https://github.com/Om-Lachake/G1_Pet_Adoption_System/tree/8546b90835f61256dbeee115a3f8b2dd105734da)
OR follow the steps below ->
### Prerequisites

1. Node.js installed on your system  
2. MongoDB running locally or on a cloud service
3. Have git installed

### Steps

1. Clone the repository:  
   ```bash
   $ git clone https://github.com/Om-Lachake/G1_Pet_Adoption_System/tree/8546b90835f61256dbeee115a3f8b2dd105734da
2. Set up .env and other files:
-  Create a **.env** in the server directory with the following
   - MONGO_URI (MongoDB URI either localhost or cloud)
   - KEY (random key for JWT Auth)
   - AKEY (random key for JWT Auth)
   - CLIENT_ID (Get from google cloud console)
   - CLIENT_SECRET (Get from google cloud console)
   - USER_EMAIL (Gmail through which mails will be transoprted)
   - USER_PASS (password of said Gmail account)
   - CLIENT_ID_SMTP (Get from google cloud console)
   - CLIENT_SECRET_SMTP (Get from google cloud console)
   - REFRESH_TOKEN (Get from google cloud console)
   - ACCESS_TOKEN (Get from google cloud console)
   - BACKEND_URL=http://localhost:3000
   - FRONTEND_URL=http://localhost:5173
-  Create a **serviceAccountKey.json** in the server directory and copy paste the firebase key in the same.
-  Create a **.env** in the client directory
   - VITE_BACKEND_URL=http://localhost:3000
   - VITE_FRONTEND_URL=http://localhost:5173
3. Set up Backend:
    ```bash
    $ cd server
    $ npm install
    $ npm run dev 
4. set up Frontend:
   ```bash
   $ cd client
   $ npm install
   $ npm run dev
## Acknowledgments
### References used:
- [Javascript-Course](https://youtu.be/EerdGm-ehJQ?feature=shared)
- [Node.js-Course](https://youtu.be/Oe421EPjeBE?feature=shared)
- [HTML-CSS-Course](https://youtu.be/G3e-cpL7ofc?feature=shared)
- [JWT-Auth-Reference](https://youtu.be/ohIAiuHMKMI?feature=shared)
- [e-Commerce-Project-Reference](https://youtube.com/watch?v=_4CPp670fK4&si=xz31yOVe3Z-nytwm)
### Contributors:
- [@Maharshi Raval - 202201003](https://github.com/Maharshi1808)
- [@Om Lachake - 202201017](https://github.com/Om-Lachake)
- [@Vivek Patel - 202201025]()
- [@Tanay Jain - 202201026](https://github.com/Tanay2023)
- [@Bhavya Kantelia - 202201029](https://github.com/Bhavyak-29)
- [@Anjali Chandwani - 202201032](https://github.com/anjalichandwani12)
- [@Rajan Moradiya - 202201063]()
- [@Preet Dave - 202201072](https://github.com/DavePreet)
- [@Snehil Suhas - 202201098](https://github.com/Suhas-Hash)

---
## Support 

For support, email happytailsg1@gmail.com or raise an issue on the GitHub repository.




