# Real-timeChat-Application-using-Socket.io
💬 Resilient Real-Time Chat Application<br/>
Tech Stack: React.js, Material UI, CSS, Express.js, Socket.IO, SQLite, Node.js Cluster Adapter<br/>
Built a real-time chat app using React (frontend) and Socket.IO + Express (backend) enabling multiple users to communicate concurrently.<br/>
Designed a responsive and user-friendly chat interface using Material UI and custom CSS.<br/>
Implemented message acknowledgment with retry logic:<br/>
Client-side: Automatically resends messages if acknowledgment (ACK) is not received within timeout.<br/>
Server-side: Stores all messages persistently using SQLite.<br/>
Used Socket.IO’s connection state recovery, and added custom recovery logic to resend messages from the last known state in case of reconnection failure.<br/>
Ensured resilience against temporary network failures by tracking delivery status per user.<br/>
Scaled horizontally using Node.js clustering and Socket.IO Cluster Adapter for improved performance across CPU cores.<br/>

cd ChatApp<br/>
node index.js<br/>

<img width="472" height="410" alt="image" src="https://github.com/user-attachments/assets/9d2fc2e0-d7b8-413f-9acc-e0ebca7defec" /><\br>


<img width="1882" height="989" alt="Screenshot 2025-07-30 131630" src="https://github.com/user-attachments/assets/fe4a7959-91d1-49b4-a79c-d8bb73e09be9" />

