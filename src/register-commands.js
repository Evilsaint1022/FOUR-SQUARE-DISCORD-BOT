// Register-Commands.js ---------------------------------------------------------------------------------------------------------------------------------

require('dotenv').config();
const { REST, Routes } = require('discord.js');

// Add your commands here
const commands = [ 

// ------------------------------------------------- @Everyone Application Commands ---------------------------------------------------------------------

{
    name: 'ping',
    description: 'Checks the bot latency!',
},
{
    name: 'avatar',
    description: 'Displays the avatar of a specified user or your own.',
    options: [
        {
            name: 'user',
            description: 'The user whose avatar you want to see',
            type: 6,
            required: false,
        },
    ],
},
{
    name: 'cat',
    description: 'Get a random cat image from The Cat API',
},
{
    name: 'dog',
    description: 'Get a random dog image from The Dog API',
},

// ------------------------------------------------- @Staff Application Commands ------------------------------------------------------------------------

];

// Rest -------------------------------------------------------------------------------------------------------------------------------------------------

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Register Commands ------------------------------------------------------------------------------------------------------------------------------------

const registerCommands = async () => {
    try {
        if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
            console.error('❌ Missing required environment variables: TOKEN, CLIENT_ID, or GUILD_ID.');
            return;
        }

        // Attempt to register guild commands first
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );

    } catch (err) {
        if (err.code === 50001) {
        } else {
        }

        try {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
        } catch (globalErr) {
            console.error('❌ Failed to register global commands:', globalErr);
        }
    }
};

// Exporting Register Commands --------------------------------------------------------------------------------------------------------------------------------

module.exports = { registerCommands };
