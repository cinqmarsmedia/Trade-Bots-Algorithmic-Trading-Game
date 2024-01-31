# Trade Bots
 
 <a href="https://www.cinqmarsmedia.com/tradebots/">Trade Bots</a> is a new steam indie game featuring algorithmic trading of stocks and crypto with technical & quantitative analysis. In this elaborate bot trading simulator game, players buy or sell thousands of real, financial market assets while learning wall street patterns and technical indicators. As the capital in your portfolio increases, unlock upgrades that help expedite and automate gameplay with custom-built algorithmic trading using artificial intelligence and bots. Available for all platforms on <a href="https://store.steampowered.com/app/1899350/Trade_Bots_A_Technical_Analysis_Simulation/">Steam</a> and <a href="https://cinqmarsmedia.itch.io/tradebots">Itch.io</a>. 
 
The game is created and published by the  educational non-profit <a href="https://www.cinqmarsmedia.com">Cinq-Mars Media</a>.

# Getting Started

* Download Node v10.24.1 (<a href="https://github.com/nvm-sh/nvm">NVM</a> is recommended for convenience)
* <b>cd</b> into codebase directory and run <b>npm ci</b>
* The command <b>npm start</b> should launch the project on localhost. 


# Adding CSV Data

For the sake of space and distribution issues, the repo only comes with one stock, MSFT. To add more, you can find others online or generate dummy data. Add them to src/assets/stocks with the ticker in the title, and then add this ticker (without the .csv file extension) to the array "activeTickers" in constants.ts. Example csv format can be found <a href="https://www.cinqmarsmedia.com/tradebots/docs/example.csv">here</a>

# Debugging Userdata
You can load a game save by changing the boolean <b>debugUserData</b> in main.js and pasting the contents of the save game in /userdata. Without the .csv for that particular investment, you will encounter an error so dummy data should be made (see above)

# Resources

Please check out the <a href="https://www.cinqmarsmedia.com/tradebots/guide/index.html">Basic Guide </a> to get started with gameplay, and later the <a href="https://www.cinqmarsmedia.com/tradebots/docs/#/">Advanced Docs</a> for documentation on the algorithmic trading features. Feel free to reach out to <a href="mailto:info@cinqmarsmedia.org">info@cinqmarsmedia.org</a> with any questions. 

While many of our projects make use of open source software, the developers would like to particularly acknowledge Andre Dumas's <a href="https://github.com/andredumas/techan.js">TechanJS</a> which proved invaluable. 


