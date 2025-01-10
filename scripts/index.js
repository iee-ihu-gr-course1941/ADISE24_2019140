$(document).ready(function () {
    // Check for existing game
    $.ajax({
        url: './api/get_game.php',
        method: 'GET',
        success: function (response) {
            response = JSON.parse(response);
            if (!response.error) {
                document.getElementById("continue-game").removeAttribute("disabled");
            }
        }
    });

    // Trigger start game on Enter key press
    $('#player1, #player2').on('keydown', function (event) {
        if (event.key === 'Enter') {
            $('#start-game').click();
        }
    });

    // Start game button click event
    document.getElementById('start-game').addEventListener('click', function () {
        // Get the player names
        const player1 = document.getElementById('player1').value.trim();
        const player2 = document.getElementById('player2').value.trim();

        if (!player1 || !player2 || player1 == player2) {
            document.getElementById('error-msg').style.opacity = '100%';
            return;
        }

        $.ajax({
            url: 'api/start_game.php',
            type: 'POST',
            data: {
                player1_name: player1,
                player2_name: player2
            },
            success: function () {
                window.location.href = './pages/game.html';
            },
            error: function (xhr, status, error) {
                console.error('Error starting game:', error);
            }
        });
    });


    // Redirect to How to Play page
    document.getElementById('howtoplay-game-button').addEventListener('click', function () {
        window.location.href = './pages/howToPlay.html';
    });

    // Redirect to Continue Game page
    document.getElementById('continue-game').addEventListener('click', function () {
        window.location.href = './pages/game.html';
    });

    // On scoreboard button press
    document.getElementById('scoreboard-game-button').addEventListener('click', function () {
        const scoreboardContainer = document.createElement('div');
        scoreboardContainer.className = 'start-container';
        scoreboardContainer.innerHTML = `
            <img src="./img/ataxx.png" alt="Ataxx Game">
            <div class="scrollable-container">
                <table border="1" style="width: 100%; text-align: center;">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Wins</th>
                        </tr>
                    </thead>
                    <tbody id="scoreboard-body">
                        <!-- Scores will be populated here -->
                    </tbody>
                </table>
            </div>
            <button id="back-button">Back</button>
        `;

        const mainContainer = document.getElementById('main-container');
        mainContainer.replaceWith(scoreboardContainer);

        // Fetch and display scores
        $.ajax({
            url: './api/players_history.php', // Ensure the correct endpoint
            method: 'GET',
            success: function (response) {
                // Check if response is already parsed or needs parsing
                let scores;
                if (typeof response === 'string') {
                    try {
                        scores = JSON.parse(response);
                    } catch (error) {
                        console.error('Invalid JSON response:', response);
                        alert('Error: Invalid JSON response from server.');
                        return;
                    }
                } else {
                    scores = response;
                }

                const scoreboardBody = document.getElementById('scoreboard-body');
                scores.forEach(score => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${score.username}</td>
                        <td><b>${score.wins}</b></td>
                    `;
                    scoreboardBody.appendChild(row);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching scoreboard:', error);
                const scoreboardBody = document.getElementById('scoreboard-body');
                scoreboardBody.innerHTML = `<tr><td colspan="2">Error fetching data.</td></tr>`;
            }
        });

        document.getElementById('back-button').addEventListener('click', function () {
            scoreboardContainer.replaceWith(mainContainer);
        });
    });
});