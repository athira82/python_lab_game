# Python Lab — Learn, Code, Build
Static site (HTML/CSS/JS + Pyodide). No backend, database, accounts or paid APIs.

## Run locally
    cd python-lab && python -m http.server 8000   # then open http://localhost:8000
Internet is needed (Pyodide loads from the jsDelivr CDN).

## Publish on GitHub Pages
    git init && git add . && git commit -m "Python Lab: loops"
    git branch -M main && git remote add origin https://github.com/YOUR-USER/python-lab.git
    git push -u origin main
Then: repo Settings > Pages > Deploy from branch > main / (root).

## Add a new topic
Add a new key to `TOPICS` in `data/lessons.js` (same shape as `loops`). The engine files need no changes.
Notes: input() reads from the Input box (one line per call). Programs are stopped after 5 seconds.
