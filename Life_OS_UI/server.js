import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4001; // diffrent port from UI's dev server

//test
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/accounts", (req, res) => {
  const pythonScriptPath = path.resolve(
    __dirname,
    "../Software_Projects/plaid-assistant/ai-fin-tracker/fetch_accounts.py"
  );
  const pythonScriptDir = path.dirname(pythonScriptPath);

  // Use spawn to run the python script
  // We set the 'cwd' (current working directoyy) to the script directory
  // to ensure it can find its .env file.
  const pythonProcess = spawn("python3", [pythonScriptPath], {
    cwd: pythonScriptDir,
  });

  let dataString = "";
  //Listen for data coming from the python script's output
  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  // Listen for any errors from the python script
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data}`);
  });

  // When the script finishes, process its output
  pythonProcess.on('close', (code) => {
    if (code === 0) {
       // If success retrieval
      try {
        const jsonData = JSON.parse(dataString); // ...try to parse the output as JSON...
        res.json(jsonData); // ...and send it to the fronend.
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to parse Python script output." });
      }
    } else {
      // if the script failed...
      res.status(500).json({ error: "Python script failed to execute." });
    }
  });
});

//This starts the server and tells it to listen for request on our chosen port
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
