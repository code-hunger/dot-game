# Dot game

On each turn a player places a line between two dots. If one makes a square, it gets filled with the player's colour and the same player has to click again. Wins the player with most squares with his colour.

# How it works
Each dot has unique id calculated by the formula `y * WIDTH + x`  
Two connected dots make a *line*.  
The array `lines` maps a dot to all the dots it's connected to. The dots in `lines` are represented with their ids. This way it's very easy to check whether two dots are connected using `lines[pointA].indexOf(pointB)`

# Todo

- **Create an AI player**
- Simplify the algorithm for square check.
- Simplify the mouseMove function.
- Write it in c++, java, or python-qt. Create an android app.
