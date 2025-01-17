# ElecSync

## Project Overview

The **House Electricity Consumption Smart Meter App** is designed to provide users with a comprehensive tool for visualizing their power consumption and facilitating the purchase of electricity. The app seamlessly integrates with smart meters, allowing purchased electricity to be directly credited to the meter.

---

## Project Structure

The project has the following directory structure:

```
ElecSync/
├── app/
│   ├── back-end/
│   └── front-end/
```

### 1. **Back-end**

Located in the `app/back-end/` folder, the back-end provides the server-side logic for handling user data, electricity purchases, and communication with smart meters.

### 2. **Front-end**

Located in the `app/front-end/` folder, the front-end is a React Native app designed to provide an intuitive and user-friendly interface for users.

---

## Installation Instructions

To set up the project on your local machine:

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ElecSync
```

### 2. Navigate to the App Directory

```bash
cd app
```

### 3. Install Dependencies

#### Back-end

```bash
cd back-end
npm install
```

#### Front-end

```bash
cd ../front-end
npm install
```

---

## Running the Application

### 1. Starting the Back-end Server

Navigate to the `back-end` directory and run:

```bash
nodemon index.js
```

This will start the server, which will handle API requests.

### 2. Starting the Front-end Application

Navigate to the `front-end` directory and run:

```bash
npm start
```

Follow the instructions to scan the QR code provided. This will launch the React Native app.

---

## Notes

- Ensure you have **Node.js** and **npm** installed on your system.
- Remember to set your custom environment variablesss in the **.env** files
- For the front-end, you may need to have a mobile emulator or a device with the Expo app installed to scan the QR code.
- For the back-end, make sure you have **nodemon** installed globally or install it locally using:
  ```bash
  npm install -g nodemon
  ```

---

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Submit a pull request for review.




