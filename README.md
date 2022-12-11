[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=9490517&assignment_repo_type=AssignmentRepo)

Memmory Game:

A simple memmory game written in JavaScript using DOM manipulation.
The game features are :

- All previous scores are stored at the browser`s local storage.
- Card shuffle algorithm used : Fisher-Yates
- Score calculdated as follow :
   " 100 + (10 * currGameData.row * currGameData.col) - steps - (10 *  currGameData.delay) " 
  - base score = 100
  - added - 10 * number of card played (choose more cards, earn more points).
  - substruct - number of steps needed to complete the game.
  - substruct - 10 * deley time factor (use as low as you can, and the penelty will be less)
  

