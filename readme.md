# Ataxx Game

To play the game, click [here](https://users.it.teithe.gr/~iee2019140/adise/).

## Πώς να Παίξετε Ataxx

Το Ataxx είναι ένα παιχνίδι στρατηγικής για δύο παίκτες που παίζεται σε έναν πίνακα 7x7. Ο στόχος του παιχνιδιού είναι να καταφέρετε να έχετε την πλειοψηφία των κομματιών στον πίνακα στο τέλος του παιχνιδιού, μετατρέποντας όσο το δυνατόν περισσότερα από τα κομμάτια του αντιπάλου.

### Κανόνες Παιχνιδιού:

- Κάθε παίκτης αρχίζει με δύο κομμάτια του είτε μπλέ είτε κόκκινα. Το παιχνίδι ξεκινά με τα δύο κομμάτια να τοποθετούνται στις δύο γωνίες του πίνακα, με τα μπλέ στην επάνω αριστερή γωνία και τα κόκκινα στην κάτω δεξιά γωνία. Το μπλε παίζει πρώτο.
- Κατά τη διάρκεια του γύρου τους, οι παίκτες μετακινούν ένα από τα κομμάτια τους είτε ένα είτε δύο τετράγωνα σε οποιαδήποτε κατεύθυνση σε ένα κενό τετράγωνο. Οι διαγώνιες αποστάσεις είναι ίδιες με τις ορθογώνιες αποστάσεις, π.χ. είναι νόμιμο να μετακινηθείτε σε ένα τετράγωνο που απέχει δύο θέσεις τόσο κάθετα όσο και οριζόντια.
- Ένα κομμάτι μπορεί επίσης να μετακινηθεί σε L-σχήμα δύο τετραγώνων, όμοιο με το άλμα του ιππότη στο σκάκι.
- Εάν ο προορισμός είναι δίπλα στην αρχική θέση, τότε δημιουργείται ένα νέο κομμάτι στο τετράγωνο προορισμού. Διαφορετικά, το κομμάτι από την αρχική θέση μετακινείται στον προορισμό.
- Μετά τη μετακίνηση, όλα τα κομμάτια του αντιπάλου που είναι δίπλα στο τετράγωνο του προορισμού μετατρέπονται στο χρώμα του παίκτη που κινείται.
- Το παιχνίδι τελειώνει όταν γεμίσουν όλοι οι τετράγωνοι ή αν ένας από τους παίκτες δεν έχει πλέον κομμάτια. Ο παίκτης με τα περισσότερα κομμάτια κερδίζει.

---

## Project Structure

The project is organized into several folders to ensure a clear and modular structure:

- **`api/`**: Contains PHP scripts for managing game functionality, including game creation, updates, and history.
- **`img/`**: Stores image assets like game logos and background images.
- **`pages/`**: HTML pages for the game interface and instructions.
- **`scripts/`**: JavaScript files for game logic and interactivity.
- **`style/`**: CSS files for styling the game and its pages.
- **Root Files**: Includes the main `index.html` file.

Each directory is designed to separate concerns, making it easier to manage and develop the project.

---

## API Documentation

### API Endpoints

- **`abandon_game.php`**  
  Abandons an ongoing game. Fetches the `game_id` from the session and updates the games table accordingly.

- **`complete_game.php`**  
  Completes a game. Retrieves the `game_id` from the session and the `winner` from a POST request, then updates the games table with the result.

- **`game_history.php`**  
  Provides the overall win history of both players as well as their head-to-head results. Retrieves the `game_id` from the session.

- **`get_game.php`**  
  Fetches the details of the current game from the database using the `game_id` from the session.

- **`players_history.php`**  
  Returns a list of all players along with their total wins from the `Players` table.

- **`sql.php`**  
  A utility script used by all other scripts to execute SQL queries on the database and return the results.

- **`start_game.php`**  
  Creates a new game. Accepts `player1_name` and `player2_name` via a POST request and sets the `game_id` in the session.

- **`update_game.php`**  
  Updates the current state of the game. Fetches the `game_id` from the session, and updates the `board` and `currentPlayer` using data from a POST request.

---
