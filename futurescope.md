# Future Scope

Planned features for the live quiz app.

## 1. Live player lobby
- While the host waits to start, show the list and count of players who have joined.
- Players join and leave the list as they connect and disconnect.

## 2. Join link / QR code
- Let players open `/user?code=XXXX` with the room code already filled in.
- Show a QR code for that link on the host screen so players can scan it to join.

## 3. Answer stats per question
- After each question, show the host and players how many picked each option.
- Show the result as a bar chart.

## 4. Answer reveal and final podium
- Show the correct answer after each question ends.
- Show a top-3 podium screen when the quiz finishes.

## 5. Quiz history and export
- Save each finished quiz session (players, scores, answers) in MongoDB.
- Add a "Past sessions" page to the admin dashboard.
- Let the host export a session's results as a CSV file.

## 6. Kick a player
- Let the host remove a player from the room, for example one with an offensive name.

## 7. Configurable time and points
- Set the time limit for each question in the template builder.
- Set the points for each question and choose whether faster answers earn a speed bonus.

## 8. Template management
- Edit existing templates (the `PUT /templates/:id` API already exists).
- Upload images for questions (the `image` field already exists in the schema).
- Ask for confirmation before deleting a template.
