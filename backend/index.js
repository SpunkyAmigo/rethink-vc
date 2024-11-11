const express = require('express');
const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const GIT_REPO_PATH = 'F:/FYP/padcontent';
const PAD_FILE_PATH = path.join(GIT_REPO_PATH, 'pad_content.txt');
const git = simpleGit(GIT_REPO_PATH);




async function fetchPadContent() {
    const padID = 'meeting';
    const etherpadApiUrl = `http://127.0.0.1:9001/api/1/getText?apikey=e2f0fbf1dc7ced01e483422fe0aabe64699ea2eaa52d3c4291cd347a487af84f&padID=meeting`;

    const response = await fetch(etherpadApiUrl);
    const data = await response.json();

    if (data.code === 0) {
        return data.data.text;
    } else {
        throw new Error('Failed to fetch pad content');
    }
}


// API to Commit Changes
app.post('/api/commit', async (req, res) => {
    const { commitMessage } = req.body;
   
    // Fetch pad content from Etherpad API
    const padContent = await fetchPadContent(); // Implement this function to get content from Etherpad

    // Save the pad content to a file
    fs.writeFileSync(PAD_FILE_PATH, padContent);

    try {
        // Stage changes, commit with message
        await git.add(PAD_FILE_PATH);
        await git.commit(commitMessage);

        res.status(200).send('Commit successful');
    } catch (error) {
        console.error('Commit failed:', error);
        res.status(500).send('Commit failed');
    }
});

// API to Push Changes
app.post('/api/push', async (req, res) => {
    try {
        // Push to GitHub
        await git.push();
        res.status(200).send('Push successful');
    } catch (error) {
        console.error('Push failed:', error);
        res.status(500).send('Push failed');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
