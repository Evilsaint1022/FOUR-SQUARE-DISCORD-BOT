// Index.js -------------------------------------------------------------------------------------------------------------------------
//
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//             Created by Evilsaint1022
// ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
//
// ------------------------------------------------- @Index.js ----------------------------------------------------------------------

require('dotenv').config();
const { loadEvents } = require('../src/Handlers/eventHandler');
const commandHandler = require('../src/Handlers/commandHandler');
const { registerCommands } = require('./register-commands');
const loadservers = require('../src/Functions/loadservers');
const { Client, Collection, Partials, GatewayIntentBits, ActivityType, } = require('discord.js');
const { user, Message, GuildMember, ThreadMember } = Partials;

// Load Console Colors --------------------------------------------------------------------------------------------------------------

const colors = require('colors'); // For console colors

// loads colors globally for console use.

// ----------------------------------------------------------------------------------------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [user, Message, GuildMember, ThreadMember]
});

// Collections for commands and events ---------------------------------------------------------------------------------------------

client.events = new Collection();
client.commands = new Map();

// Ready Event ---------------------------------------------------------------------------------------------------------------------

client.once("ready", () => {
    console.log(`[🌿│${client.user.tag} Is Online!]`.bold.green);

    // Loading Servers
    loadservers(client);

    // Registers Application Commands
    registerCommands(client);

    // Loading the Handlers
    loadEvents(client);
    commandHandler(client);

// Set bot activity ----------------------------------------------------------------------------------------------------------------

    setInterval(() => {
        const activities = [
            "Shopping at PaknSave",
            "✌🏻Nek Minnit",
            "🤌🏼Awww Gummon",
            "🗿Built Like a Mitre 10",
            "Made in New Zealand",
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity, { type: ActivityType.Custom });
    }, 5000); // Update activity every 5 seconds
});

// Interaction Command Handler -----------------------------------------------------------------------------------------------------

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Client Login ---------------------------------------------------------------------------------------------------------------------

client.login(process.env.TOKEN);
