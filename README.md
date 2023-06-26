# About project

This project is a small snake game written by me using my 2 years of front-end knowledge. When every programmer starts coding, they want to implement a game, which seems to be the process that everyone goes through. I chose to use the newly learned TypeScript language to implement this project, which includes snake actions, links between various classes, methods, and properties. The whole project does not use any framework, and uses native JS to manipulate the DOM.

# Game features

Snake game is a classic arcade game. Players control a snake to eat food. Every time the snake eats a piece of food, it will become longer. The goal of the game is to eat as much food as possible while avoiding the snake from hitting it. own body or play boundaries. Here are the game features implemented in this project:

- Game start and pause: The player can start or pause the game by pressing the space bar.
- Snake movement: Players can use the arrow keys on the keyboard to control the movement direction of the snake.
- Food generation: The game will generate food at random locations, and the player needs to control the snake to eat the food.
- Score calculation: every time the player eats a piece of food, the score of the game will increase and will be displayed on the interface.
- Collision detection: The game detects if the snake has collided with its own body or game boundaries, and if so, the game is over.

# Technical details

This project uses the following techniques and concepts:

- TypeScript: The entire project is written in the TypeScript language, which adds static type checking and other new features to JavaScript.
- Native JS to manipulate DOM: Without using any framework or library, I use native JS to manipulate HTML DOM elements, including creating, modifying and listening to events.
- Object-Oriented Programming: By using classes, methods, and properties, I encapsulated the different parts of the game, making the code more structured and maintainable.
- Game Loop: By using the requestAnimationFrame method, I implemented a game loop that allows the game to run at a smooth frame rate.
- Collision Detection Algorithm: I implemented a simple collision detection algorithm that detects if the snake hits its own body or game bounds. This algorithm can quickly judge the collision event and trigger the logic of the end of the game.

# Epilogue

The Snake game project is a practical project in the process of learning front-end knowledge. It demonstrates the ability of native JavaScript and TypeScript to build simple games. I hope this project can provide beginners with some inspiration about JavaScript and DOM operations, and it is also a realization of my programming dream. You are welcome to try to run and explore this snake game, hope you can enjoy it! If you have any questions or suggestions, please feel free to contact me.
